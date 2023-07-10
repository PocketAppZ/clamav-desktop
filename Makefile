test:
	cd ./src-tauri && cargo test --exclude glob --no-fail-fast --workspace -- --nocapture
test-cover:
	cd ./src-tauri && cargo tarpaulin --exclude glob --frozen --no-fail-fast --out Xml --workspace -- --nocapture
test-trace:
	export RUST_BACKTRACE=1 && cd ./src-tauri && cargo test --no-fail-fast --workspace -- --nocapture
test-quiet:
	cd ./src-tauri && cargo test -q --no-fail-fast --workspace -- --nocapture
test-watch:
	cd ./src-tauri && cargo watch -x "test --workspace -- --nocapture"

test-cli:
	cd ./src-tauri/cli &&	cargo test --no-fail-fast -- --nocapture
test-cli-watch:
	cd ./src-tauri/cli && cargo watch -x "test -- --nocapture"

test-common:
	cd ./src-tauri/common &&	cargo test --no-fail-fast -- --nocapture
test-common-watch:
	cd ./src-tauri/common && cargo watch -x "test -- --nocapture"

test-filer:
	cd ./src-tauri/filer &&	cargo test --no-fail-fast -- --nocapture
test-filer-watch:
	cd ./src-tauri/filer && cargo watch -x "test -- --nocapture"

test-jest:
	cd ./src-tauri/jest &&	cargo test --no-fail-fast -- --nocapture
test-jest-watch:
	cd ./src-tauri/jest && cargo watch -x "test -- --nocapture"

upgrade:
	cd ./src-tauri && cargo upgrade --exclude glob
