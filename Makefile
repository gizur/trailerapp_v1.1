NODE_PATH = ./node_modules
JS_COMPILER = $(NODE_PATH)/uglify-js/bin/uglifyjs
JS_BEAUTIFIER = $(NODE_PATH)/uglify-js/bin/uglifyjs -b -i 2 -nm -ns
JS_TEST = $(NODE_PATH)/nodeunit/bin/nodeunit
JS_HINT = $(NODE_PATH)/jshint/bin/jshint

all: \
	node_modules \
    review \
	test \
    build \
    install

node_modules: Makefile
	npm install

build:
	cd ./Android/Besiktning && ant debug
	cd -

install:
	cd ./Android/Besiktning && ant installd
	cd -

review:
	$(JS_HINT) ./tests/*.js
	$(JS_HINT) ./Android/Besiktning/assets/www/js/app/models/*.js
	$(JS_HINT) ./Android/Besiktning/assets/www/js/app/util/*.js
	$(JS_HINT) ./Android/Besiktning/assets/www/js/app/*.js

test:
	$(JS_TEST) ./tests/*.js

.PHONY: all test review install build
