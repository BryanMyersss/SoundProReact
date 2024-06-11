**07/04/2024** Downgraded node to 18v lts as i kept getting error with 20v lts when trying to push new category subdocuments to mongoose model.

template:

## Section title
### 09/02/2024 - no ts interface 'mongoose.HookNextFunction'

**11/02/2024 - Update:** Turns out we didn't need 'mongoose.HookNextFunction', deleted following fix

**What was happening:** at src/models/user.models.ts, mongoose 6 and above no longer defines the interface 'mongoose.HookNextFunction'

Deprecated fix (Check update):

Fixed by writing the interface ourselves:
```ts
// Mongoose used to define this before mongoose 6. For backward's compatibility, we will now just define it ourselves.
interface HookNextFunction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error?: Error): any
}
```
[(deprecated) Github fix reference](https://github.com/Automattic/mongoose/issues/11449)