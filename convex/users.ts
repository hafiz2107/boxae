import { ConvexError, v } from 'convex/values';
import { MutationCtx, QueryCtx, internalMutation } from './_generated/server';

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  const user = await ctx.db
    .query('users')
    .withIndex('by_tokenIdentifier', (q) =>
      q.eq('tokenIdentifier', tokenIdentifier)
    )
    .first();

  if (!user) {
    throw new ConvexError('User is undefined');
  }

  return user;
}

export async function getIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError('The user must be logged in');
  }

  return identity;
}

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string()),
  },
  async handler(ctx, args) {
    await ctx.db.insert('users', {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      orgIds: user.orgIds?.length ? [...user.orgIds, args.orgId] : [args.orgId],
    });
  },
});
