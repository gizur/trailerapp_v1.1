NODE_PATH = ./node_modules
JS_COMPILER = $(NODE_PATH)/uglify-js/bin/uglifyjs
JS_BEAUTIFIER = $(NODE_PATH)/uglify-js/bin/uglifyjs -b -i 2 -nm -ns
JS_TEST = $(NODE_PATH)/nodeunit/bin/nodeunit
JS_HINT = $(NODE_PATH)/jshint/bin/hint

all: \
	node_modules \
	component.json \
	LICENSE \
    review \
	test \

node_modules: Makefile
	npm install

build:
	@rm -f $@
	cat $^ | node src/build.js | $(JS_BEAUTIFIER) > $@
	@chmod a-w $@

component.json: Makefile
	@rm -f $@
	cat ./src/component.js | node src/build.js > $@
	@chmod a-w $@

review:
	$(JS_HINT) ./tests/*.js

test:
	$(JS_TEST) ./test

clean:
	rm -rf ./component.json ./ZeroClipboard* ./LICENSE

.PHONY: all test clean
