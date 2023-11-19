cmd_Release/random.node := ln -f "Release/obj.target/random.node" "Release/random.node" 2>/dev/null || (rm -rf "Release/random.node" && cp -af "Release/obj.target/random.node" "Release/random.node")
