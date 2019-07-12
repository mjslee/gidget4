export const PATTERNS = {
	NOT_A_FUNCTION: /(.*?) is not a function$/,
	UNDEFINED: /(.*?) is undefined$/,
	NOT_DEFINED: /(.*?) is not defined$/,
	HAS_NO_PROPERTIES: /(.*?) has no properties$/,
	UNEXPECTED_TOKEN: /^Unexpected token (.*?)$/,
	UNEXPECTED_STRING: /^Unexpected string$/,
	UNEXPECTED_NUMBER: /^Unexpected number$/,
	UNEXPECTED_IDENTIFIER: /^Unexpected identifier$/,
}

export const TRANSLATIONS = {
	NOT_A_FUNCTION: "`{}` doesn't seem to be a function!",
	UNDEFINED: "I'm not sure what {} means...",
	NOT_DEFINED: "`{}` is not in my memory.",
	HAS_NO_PROPERTIES: "I couldn't find any properties for /{}/.",
	UNEXPECTED_TOKEN: "I wasn't expecting a `{}` token there!",
	UNEXPECTED_STRING: "I wasn't expecting a string there!",
	UNEXPECTED_NUMBER: "I wasn't expecting a number there!",
	UNEXPECTED_IDENTIFIER: "I wasn't expecting an identifier there!",
}
