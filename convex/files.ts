import { ConvexError, v } from 'convex/values';
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server';
import { getIdentity, getUser } from './users';
import { fileTypes } from './schema';

async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string,
  returnArray?: boolean
) {
  const user = await getUser(ctx, tokenIdentifier);

  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

  if (returnArray && !hasAccess) return [];
  if (!hasAccess) throw new ConvexError('User not autherised');

  return hasAccess;
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
    const identity = await getIdentity(ctx);
    await hasAccessToOrg(ctx, identity.tokenIdentifier, args.orgId);

    await ctx.db.insert('files', {
      name: args.name,
      orgId: args.orgId,
      fileId: args.fileId,
      type: args.type,
      storageId: args.storageId,
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await getIdentity(ctx);
    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId,
      true
    );

    if (typeof hasAccess === 'object') {
      return hasAccess;
    }

    const files = args?.query
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

    const filesWithUrl = await Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.fileId),
      }))
    );
    return filesWithUrl;
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.id('files'),
  },
  async handler(ctx, args) {
    const identity = await getIdentity(ctx);

    const file = await ctx.db.get(args.fileId);

    if (!file) throw new ConvexError('File does not exist');

    await hasAccessToOrg(ctx, identity.tokenIdentifier, file.orgId);

    return await ctx.db.delete(args.fileId);
  },
});
