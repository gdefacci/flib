export default function<T>(a:T|undefined|null):a is (null|undefined) {
	return a === undefined || a === null;
}