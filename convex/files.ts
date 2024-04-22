import { ConvexError, v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { getIdentity, getUser } from './users';
import { fileTypes, userRoles } from './schema';
import { Id } from './_generated/dataModel';

async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string,
  returnArray?: boolean
) {
  const identity = await getIdentity(ctx);
  const user = await getUser(ctx, identity.tokenIdentifier);
  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (returnArray && !hasAccess) return null;
  if (!hasAccess) throw new ConvexError('User not autherised');

  return { hasAccess, user };
}

async function hasAccessToFile(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<'files'>
) {
  const file = await ctx.db.get(fileId);
  if (!file) return null;
  const orgAccess = await hasAccessToOrg(ctx, file.orgId);

  if (!orgAccess) {
    return null;
  }

  return { ...orgAccess, file };
}

export const generateUploadUrl = mutation(async (ctx) => {
  await getIdentity(ctx);
  return await ctx.storage.generateUploadUrl();
});

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
    fileId: v.id('_storage'),
    type: fileTypes,
    storageId: v.id('_storage'),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) throw new ConvexError("User doesn't have access");

    await ctx.db.insert('files', {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type,
      storageId: args.storageId,
      authorId: hasAccess.user._id,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favoriteOnly: v.optional(v.boolean()),
    deletedOnly: v.optional(v.boolean()),
    type: v.optional(fileTypes),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId, true);

    if (!hasAccess) {
      return hasAccess;
    }

    let files = args?.query
      ? await ctx.db
          .query('files')
          .withSearchIndex('search_title', (q) =>
            q.search('name', args?.query!).eq('orgId', args.orgId)
          )
          .collect()
      : await ctx.db
          .query('files')
          .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
          .collect();

    if (args.type) {
      files = files.filter((file) => file.type === args.type);
    }

    if (args?.favoriteOnly) {
      const favFiles = await ctx.db
        .query('favorites')
        .withIndex('by_userId_orgId_fileId', (q) =>
          q.eq('userId', hasAccess.user?._id)
        )
        .collect();

      files = files.filter((file) =>
        favFiles.some((fav) => fav.fileId === file._id)
      );
    }

    if (args?.deletedOnly) {
      files = files.filter((file) => file.shouldDelete);
    } else {
      files = files.filter((file) => !file.shouldDelete);
    }

    const filesWithUrl = await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.fileId),
      }))
    );
    return filesWithUrl;
  },
});

export const clearTrash = internalMutation({
  args: {},
  async handler(ctx) {
    const files = await ctx.db
      .query('files')
      .withIndex('by_shouldDelete', (q) => q.eq('shouldDelete', true))
      .collect();

    await Promise.all(
      files.map(async (file) => {
        await ctx.storage.delete(file.fileId);
        await ctx.db.delete(file._id);
      })
    );
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id('files'),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToFile(ctx, args.fileId);
    if (!hasAccess) {
      return null;
    }
    const isAdmin =
      hasAccess.user.orgIds.find((org) => org.orgId === hasAccess.file.orgId)
        ?.role === 'admin';

    if (!isAdmin) throw new ConvexError('You are not permitted to delete');

    return await ctx.db.patch(args.fileId, {
      shouldDelete: true,
    });
  },
});

export const restoreFile = mutation({
  args: {
    fileId: v.id('files'),
  },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToFile(ctx, args.fileId);
    if (!hasAccess) {
      return null;
    }
    const isAdmin =
      hasAccess.user.orgIds.find((org) => org.orgId === hasAccess.file.orgId)
        ?.role === 'admin';

    if (!isAdmin) throw new ConvexError('You are not permitted to delete');

    return await ctx.db.patch(args.fileId, {
      shouldDelete: false,
    });
  },
});

export const toggleFav = mutation({
  args: {
    fileId: v.id('files'),
  },
  async handler(ctx, args) {
    const file = await ctx.db.get(args.fileId);

    if (!file) throw new ConvexError('File does not exist');
    const hasAccess = await hasAccessToOrg(ctx, file.orgId);
    if (!hasAccess) throw new ConvexError('User not autherised');

    const favs = await ctx.db
      .query('favorites')
      .withIndex('by_userId_orgId_fileId', (q) =>
        q
          .eq('userId', hasAccess.user?._id)
          .eq('orgId', file.orgId)
          .eq('fileId', file._id)
      )
      .first();

    if (!favs) {
      await ctx.db.insert('favorites', {
        fileId: file._id,
        orgId: file.orgId,
        userId: hasAccess.user._id,
      });
    } else {
      await ctx.db.delete(favs._id);
    }
  },
});

export const getAllFavFiles = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    const favs = await ctx.db
      .query('favorites')
      .withIndex('by_userId_orgId_fileId', (q) =>
        q.eq('userId', hasAccess.user?._id).eq('orgId', args.orgId)
      )
      .collect();

    return favs;
  },
});
