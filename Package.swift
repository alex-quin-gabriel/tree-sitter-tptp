// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterTptp",
    products: [
        .library(name: "TreeSitterTptp", targets: ["TreeSitterTptp"]),
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterTptp",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterTptpTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterTptp",
            ],
            path: "bindings/swift/TreeSitterTptpTests"
        )
    ],
    cLanguageStandard: .c11
)
