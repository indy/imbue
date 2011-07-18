docs:
	docco **/*.js

test:
	expresso test/*.test.js

.PHONY: test docs
