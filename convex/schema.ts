import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const fileTypes = v.union(
  v.literal('image'),
  v.literal('csv'),
  v.literal('pdf')
);

export const userRoles = v.union(v.literal('admin'), v.literal('member'));

export default defineSchema({
  files: defineTable({
    name: v.string(),
    orgId: v.string(),
    type: fileTypes,
    fileId: v.id('_storage'),
    storageId: v.id('_storage'),
    shouldDelete: v.optional(v.boolean()),
  })
    .searchIndex('search_title', {
      searchField: 'name',
      filterFields: ['orgId'],
    })
    .index('by_orgId', ['orgId']),

  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: userRoles,
      })
    ),
  }).index('by_tokenIdentifier', ['tokenIdentifier']),

  favorites: defineTable({
    fileId: v.id('files'),
    orgId: v.string(),
    userId: v.id('users'),
  }).index('by_userId_orgId_fileId', ['userId', 'orgId', 'fileId']),
});
