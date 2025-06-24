const processExclusiveStartKey = (keyQuery: string) => {
	if (keyQuery !== "undefined") {
		return JSON.parse(keyQuery);
	} else {
		return undefined;
	}
};

export default processExclusiveStartKey;
