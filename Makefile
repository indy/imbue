EXPRESSO ?= `which expresso`
DOCCO ?= `which docco`

test:
	@@if test ! -z ${EXPRESSO}; then \
		expresso test/*.test.js; \
	else \
		echo "Running the tests requires expresso."; \
		echo "You can install it by running: npm install expresso -g"; \
	fi

docs:
	@@if test ! -z ${DOCCO}; then \
		docco index.js; \
		docco lib/*.js; \
	else \
		echo "You must have docco installed in order to build the documentation."; \
		echo "You can install it by running: npm install docco -g"; \
	fi

.PHONY: test docs
