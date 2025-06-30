package tree_sitter_tptp_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_tptp "github.com/tree-sitter/tree-sitter-tptp/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_tptp.Language())
	if language == nil {
		t.Errorf("Error loading Thousand Problems for Theorem Provers grammar")
	}
}
