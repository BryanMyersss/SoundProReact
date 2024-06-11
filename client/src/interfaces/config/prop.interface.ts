export default interface PropInterface {
  icon: string;
  displayName: { spanish?: string, default: string };
  placeholder: { spanish?: string, default: string };
  lookupNames: { spanish?: string[], english?: string[]};
  _id: string;
}
