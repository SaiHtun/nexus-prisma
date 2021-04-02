import { schema } from 'nexus';
import { booleanArg, stringArg } from 'nexus/components/schema';


schema.objectType({
  name: 'Post',
  definition(t) {
    t.int('id'),
    t.string('title'),
    t.string('body'),
    t.boolean('published')
  }
})

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('drafts', {
      type: 'Post',
      list: true,
      nullable: false,
      resolve(root, args, ctx) {
        return ctx.db.posts.filter(p => p.published !== true)
      }
    })
  }
})

schema.extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createDraft', {
      type: 'Post',
      nullable: false,
      args: {
        title: stringArg({required: true}),
        body: stringArg({required: true}),
      },
      resolve(root, args, ctx) {
        const draft = {
          id: ctx.db.posts.length +1,
          title: args.title,
          body: args.body,
          published: false
        }
        ctx.db.posts.push(draft);
        return draft
      }
    })
  }
})