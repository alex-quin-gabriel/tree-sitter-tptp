import XCTest
import SwiftTreeSitter
import TreeSitterTptp

final class TreeSitterTptpTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_tptp())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Thousand Problems for Theorem Provers grammar")
    }
}
