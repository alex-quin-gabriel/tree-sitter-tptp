/**
 * @file Tptp grammar for tree-sitter
 * @author Alex Quin Averie Gabriel <agabriel@4d6.de>
 * @license Apache 2.0
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "tptp",
  
  //word: $ => $.formula_name, // TODO make sure this covers all the identifiers
  
  rules: {

    tptp_file: $ => repeat(
      $.tptp_input
    ),
    
    tptp_input: $ => choice(
      $.line_comment,
      $.include,
      $.annotated_formula,
    ),
    
    line_comment: $ => seq(
      "%",
      /.*/
    ),
    
    include: $ => seq(
      "include",
      "(",
      $.file_name,
      optional(seq(
        ",",
        $.formula_selection
      )),
      optional(seq(
        ",",
        $.formula_name,
      )),
      ")",
      ".",
    ),
    
    file_name: $ => token(
      /'[^\x00\t\r\n\v\f']+'/
    ),

    annotated_formula: $ => field("formula", choice(
      $._tpi_annotated,
      $._thf_annotated,
      $._tff_annotated,
      $._tcf_annotated,
      $._fof_annotated,
      $._cnf_annotated,
    )),


    _tpi_annotated: $ => seq(
      "tpi",
      "(",
      field("name", $.formula_name),
      ",",
      field("role", $.formula_role),
      ",",
      field("formula", $.fof_formula),
      optional(seq(
        ",",
        $.source_identifier,
        optional($.optional_info),
      )),
      ")",
      ".",
    ),

    _thf_annotated: $ => seq(
      "thf",
      "(",
      field("name", $.formula_name),
      ",",
      field("role", $.formula_role),
      ",",
      field("formula", $.thf_formula),
      optional(seq(
        ",",
        $.source_identifier,
        optional(seq(
          ",",
          $.general_list,
        )),
      )),
      ")",
      ".",
    ),

    _tff_annotated: $ => seq(
      "tff",
      "(",
      field("name", $.formula_name),
      ",",
      field("role", $.formula_role),
      ",",
      field("formula", $.tff_formula),
      optional(seq(
        ",",
        $.source_identifier,
        optional(seq(
          ",",
          $.general_list,
        )),
      )),
      ")",
      ".",
    ),

    _tcf_annotated: $ => seq(
      "tcf",
      "(",
      field("name", $.formula_name),
      ",",
      field("role", $.formula_role),
      ",",
      field("formula", $.tcf_formula),
      optional(seq(
        ",",
        $.source_identifier,
        optional(seq(
          ",",
          $.general_list,
        )),
      )),
      ")",
      ".",
    ),

    _fof_annotated: $ => seq(
      "fof",
      "(",
      field("name", $.formula_name),
      ",",
      field("role", $.formula_role),
      ",",
      field("formula", $.fof_formula),
      optional(seq(
        ",",
        $.source_identifier,
        optional(seq(
          ",",
          $.general_list,
        )),
      )),
      ")",
      ".",
    ),

    _cnf_annotated: $ => seq(
      "cnf",
      "(",
      field("name", $.formula_name),
      ",",
      field("role", $.formula_role),
      ",",
      field("formula", $.cnf_formula),
      optional(seq(
        ",",
        $.source_identifier,
        optional(seq(
          ",",
          $.general_list,
        )),
      )),
      ")",
      ".",
    ),

    formula_role: $ => choice(
      $._lower_word,
      seq(
        $._lower_word,
        "-",
        $.general_term,
      ),
    ),

    optional_info: $ => seq(
      ",",
      $.general_list,
    ),

    thf_formula: $ => choice(
      $._thf_logic_formula,
      $._thf_atom_typing,
      seq(
        $.untyped_atom,
        "<<",
        $.atom,
      ),
    ),

    _thf_logic_formula: $ => choice(
      $._thf_unitary_formula,
      $._thf_unary_formula,
      $._thf_binary_formula,
      $._thf_defined_infix,
      $._thf_definition,
      $._thf_sequent,
    ),

    _thf_binary_formula: $ => choice(
      $._thf_binary_nonassoc,
      $._thf_binary_assoc,
      $._thf_binary_type,
    ),

    _thf_binary_nonassoc: $ => seq(
      $._thf_unit_formula,
      $.nonassoc_connective,
      $._thf_unit_formula,
    ),

    _thf_binary_assoc: $ => choice(
      $._thf_or_formula,
      $._thf_and_formula,
      $.thf_apply_formula,
    ),

    _thf_or_formula: $ => choice(
      seq(
        $._thf_unit_formula,
        "|",
        $._thf_unit_formula,
      ),
      seq(
        $._thf_or_formula,
        "|",
        $._thf_unit_formula,
      ),
    ),

    _thf_and_formula: $ => choice(
      seq(
        $._thf_unit_formula,
        "&",
        $._thf_unit_formula,
      ),
      seq(
        $._thf_and_formula,
        "&",
        $._thf_unit_formula,
      ),
    ),

    thf_apply_formula: $ => choice(
      seq(
        field('called_function', $._thf_unit_formula),
        "@",
        $._thf_unit_formula,
      ),
      seq(
        $.thf_apply_formula,
        "@",
        $._thf_unit_formula,
      ),
    ),

    _thf_unit_formula: $ => choice(
      $._thf_unitary_formula,
      $._thf_unary_formula,
      $._thf_defined_infix,
    ),

    _thf_preunit_formula: $ => choice(
      $._thf_unitary_formula,
      $._thf_prefix_unary,
    ),

    _thf_unitary_formula: $ => choice(
      $._thf_quantified_formula,
      $.thf_atomic_formula,
      $.variable,
      seq(
        "(",
        $._thf_logic_formula,
        ")",
      ),
    ),

    _thf_quantified_formula: $ => seq(
      $._thf_quantification,
      $._thf_unit_formula,
    ),

    _thf_quantification: $ => seq(
      $.thf_quantifier,
      "[",
      $._thf_variable_list,
      "]",
      ":",
    ),

    _thf_variable_list: $ => choice(
      $._thf_typed_variable,
      seq(
        $._thf_typed_variable,
        ",",
        $._thf_variable_list,
      ),
    ),

    _thf_typed_variable: $ => seq(
      $.variable,
      ":",
      $.thf_top_level_type,
    ),

    _thf_unary_formula: $ => choice(
      $._thf_prefix_unary,
      $._thf_infix_unary,
    ),

    _thf_prefix_unary: $ => seq(
      $.thf_unary_connective,
      $._thf_preunit_formula,
    ),

    _thf_infix_unary: $ => seq(
      $._thf_unitary_term,
      "!=",
      $._thf_unitary_term,
    ),

    thf_atomic_formula: $ => choice(
      $.thf_plain_atomic,
      $.thf_defined_atomic,
      $.dollar_dollar_word,
      $.thf_fof_function,
    ),

    thf_plain_atomic: $ => choice(
      $._atomic_word,
      $._thf_tuple,
    ),

    thf_defined_atomic: $ => choice(
      $.dollar_word,
      $.thf_defined_term,
      seq(
        "(",
        $._thf_conn_term,
        ")",
      ),
      $._nhf_long_connective,
      $._thf_let,
    ),

    thf_defined_term: $ => choice(
      $._defined_term,
      $._th1_defined_term,
    ),

    _thf_defined_infix: $ => seq(
      $._thf_unitary_term,
      "=",
      $._thf_unitary_term,
    ),
    
    _thf_let: $ => seq(
      "$let",
      "(",
      $._thf_let_types,
      ",",
      $._thf_let_defns,
      ",",
      $._thf_logic_formula,
      ")",
    ),

    _thf_let_types: $ => choice(
      $._thf_atom_typing,
      seq(
        "[",
        $._thf_atom_typing_list,
        "]",
      ),
    ),

    _thf_atom_typing_list: $ => choice(
      $._thf_atom_typing,
      seq(
        $._thf_atom_typing,
        ",",
        $._thf_atom_typing_list,
      ),
    ),

    _thf_let_defns: $ => choice(
      $._thf_let_defn,
      seq(
        "[",
        $._thf_let_defn_list,
        "]",
      ),
    ),

    _thf_let_defn: $ => seq(
      $._thf_logic_formula,
      ":=",
      $._thf_logic_formula,
    ),

    _thf_let_defn_list: $ => choice(
      $._thf_let_defn,
      seq(
        $._thf_let_defn,
        ",",
        $._thf_let_defn_list,
      ),
    ),

    _thf_unitary_term: $ => choice(
      $.thf_atomic_formula,
      $.variable,
      seq(
        "(",
        $._thf_logic_formula,
        ")",
      ),
    ),

    _thf_conn_term: $ => choice(
      $.nonassoc_connective,
      $.assoc_connective,
      "=",
      "!=",
      $.thf_unary_connective,
    ),

    _thf_tuple: $ => seq(
      "[",
      optional($.thf_formula_list),
      "]",
    ),


    thf_fof_function: $ => choice(
      seq(
        $._atomic_word,
        "(",
        $.thf_formula_list,
        ")",
      ),
      seq(
        $.dollar_word,
        "(",
        $.thf_formula_list,
        ")",
      ),
      seq(
        $.dollar_dollar_word,
        "(",
        $.thf_formula_list,
        ")",
      ),
    ),
    
    thf_formula_list: $ => choice(
      $._thf_logic_formula,
      seq(
        $._thf_logic_formula,
        ",",
        $.thf_formula_list,
      ),
    ),

    _thf_atom_typing: $ => choice(
      seq(
        $.untyped_atom,
        ":",
        $.thf_top_level_type,
      ),
      seq(
        "(",
        $._thf_atom_typing,
        ")",
      ),
    ),

    thf_top_level_type: $ => choice(
      $._thf_unitary_formula,
      $._thf_mapping_type,
      $.thf_apply_formula,
    ),
    
    _thf_binary_type: $ => choice(
      $._thf_mapping_type,
      $._thf_xprod_type,
      $._thf_union_type,
    ),

    _thf_mapping_type: $ => choice(
      seq(
        $._thf_unitary_formula,
        ">",
        $._thf_unitary_formula,
      ),
      seq(
        $._thf_unitary_formula,
        ">",
        $._thf_mapping_type,
      ),
    ),

    _thf_xprod_type: $ => choice(
      seq(
        $._thf_unitary_formula,
        "*",
        $._thf_unitary_formula,
      ),
      seq(
        $._thf_xprod_type,
        "*",
        $._thf_unitary_formula,
      ),
    ),

    _thf_union_type: $ => choice(
      seq(
        $._thf_unitary_formula,
        "+",
        $._thf_unitary_formula,
      ),
      seq(
        $._thf_union_type,
        "+",
        $._thf_unitary_formula,
      ),
    ),


    _thf_definition: $ => seq(
      $.thf_atomic_formula,
      "==",
      $._thf_logic_formula,
    ),

    _thf_sequent: $ => seq(
      $._thf_tuple,
      "-->",
      $._thf_tuple,
    ),

    tff_formula: $ => choice(
      $._tff_logic_formula,
      $._tff_atom_typing,
      $._tff_subtype,
    ),

    _tff_logic_formula: $ => choice(
      $._tff_unitary_formula,
      $._tff_unary_formula,
      $._tff_binary_formula,
      $._tff_defined_infix,
      $._txf_definition,
      $._txf_sequent,
    ),

    _tff_binary_formula: $ => choice(
      $._tff_binary_nonassoc,
      $._tff_binary_assoc,
    ),

    _tff_binary_nonassoc: $ => seq(
      $._tff_unit_formula,
      $.nonassoc_connective,
      $._tff_unit_formula,
    ),

    _tff_binary_assoc: $ => choice(
      $._tff_or_formula,
      $._tff_and_formula,
    ),

    _tff_or_formula: $ => choice(
      seq(
        $._tff_unit_formula,
        "|",
        $._tff_unit_formula,
      ),
      seq(
        $._tff_or_formula,
        "|",
        $._tff_unit_formula,
      ),
    ),

    _tff_and_formula: $ => choice(
      seq(
        $._tff_unit_formula,
        "&",
        $._tff_unit_formula,
      ),
      seq(
        $._tff_and_formula,
        "&",
        $._tff_unit_formula,
      ),
    ),

    _tff_unit_formula: $ => choice(
      $._tff_unitary_formula,
      $._tff_unary_formula,
      $._tff_defined_infix,
    ),

    _tff_preunit_formula: $ => choice(
      $._tff_unitary_formula,
      $._tff_prefix_unary,
    ),

    _tff_unitary_formula: $ => choice(
      $._tff_quantified_formula,
      $._tff_atomic_formula,
      $.variable,
      seq(
        "(",
        $._tff_logic_formula,
        ")",
      ),
    ),
    
    _tff_quantified_formula: $ => seq(
      $.tff_quantifier,
      "[",
      $._tff_variable_list,
      "]",
      ":",
      $._tff_unit_formula,
    ),

    _tff_variable_list: $ => choice(
      $._tff_variable,
      seq(
        $._tff_variable,
        ",",
        $._tff_variable_list,
      ),
    ),

    _tff_variable: $ => choice(
      $._tff_typed_variable,
      $.variable,
    ),

    _tff_typed_variable: $ => seq(
      $.variable,
      ":",
      $.tff_atomic_type,
    ),

    _tff_unary_formula: $ => choice(
      $._tff_prefix_unary,
      $._tff_infix_unary,
    ),

    _tff_prefix_unary: $ => seq(
      $.tff_unary_connective,
      $._tff_preunit_formula,
    ),

    _tff_infix_unary: $ => seq(
      $._tff_unitary_term,
      "!=",
      $._tff_unitary_term,
    ),

    _tff_atomic_formula: $ => choice(
      $.tff_plain_atomic,
      $.tff_defined_plain,
      $.tff_system_atomic,
    ),

    tff_plain_atomic: $ => choice(
      $._atomic_word,
      seq(
        $._atomic_word,
        "(",
        $._tff_arguments,
        ")",
      ),
    ),

    tff_defined_plain: $ => choice(
      $.dollar_word,
      seq(
        $.dollar_word,
        "(",
        $._tff_arguments,
        ")",
      ),
      $._nxf_atom,
      $._txf_let,
    ),

    _tff_defined_infix: $ => seq(
      $._tff_unitary_term,
      "=",
      $._tff_unitary_term,
    ),

    tff_system_atomic: $ => choice(
      $.dollar_dollar_word,
      seq(
        $.dollar_dollar_word,
        "(",
        $._tff_arguments,
        ")",
      ),
    ),

    _txf_let: $ => seq(
      "$let",
      "(",
      $._txf_let_types,
      ",",
      $._txf_let_defns,
      ",",
      $.tff_term,
      ")",
    ),

    _txf_let_types: $ => choice(
      $._tff_atom_typing,
      seq(
        "[",
        $._tff_atom_typing_list,
      "]",
      ),
    ),

    _tff_atom_typing_list: $ => choice(
      $._tff_atom_typing,
      seq(
        $._tff_atom_typing,
        ",",
        $._tff_atom_typing_list,
      ),
    ),

    _txf_let_defns: $ => choice(
      $._txf_let_defn,
      seq(
        "[",
        $._txf_let_defn_list,
        "]",
      ),
    ),

    _txf_let_defn: $ => seq(
      $._txf_let_LHS,
      ":=",
      $.tff_term,
    ),

    _txf_let_LHS: $ => choice(
      $.tff_plain_atomic,
      $.txf_tuple,
    ),

    _txf_let_defn_list: $ => choice(
      $._txf_let_defn,
      seq(
        $._txf_let_defn,
        ",",
        $._txf_let_defn_list,
      ),
    ),

    _nxf_atom: $ => seq(
      $._nxf_long_connective,
      "@",
      "(",
      $._tff_arguments,
      ")",
    ),

    tff_term: $ => choice(
      $._tff_logic_formula,
      $._defined_term,
      $.txf_tuple,
    ),

    _tff_unitary_term: $ => choice(
      $._tff_atomic_formula,
      $._defined_term,
      $.txf_tuple,
      $.variable,
      seq(
        "(",
        $._tff_logic_formula,
        ")",
      ),
    ),

    txf_tuple: $ => seq(
      "[",
      optional($._tff_arguments),
      "]",
    ),

    _tff_arguments: $ => choice(
      $.tff_term,
      seq(
        $.tff_term,
        ",",
        $._tff_arguments,
      ),
    ),

    _tff_atom_typing: $ => choice(
      seq(
        $.untyped_atom,
        ":",
        $.tff_top_level_type,
      ),
      seq(
        "(",
        $._tff_atom_typing,
        ")",
      ),
    ),

    tff_top_level_type: $ => choice(
      $.tff_atomic_type,
      $._tff_non_atomic_type,
    ),

    _tff_non_atomic_type: $ => choice(
      $.tff_mapping_type,
      $.tf1_quantified_type,
      seq(
        "(",
        $._tff_non_atomic_type,
        ")",
      ),
    ),

    tf1_quantified_type: $ => seq(
      "!>",
      "[",
      $._tff_variable_list,
      "]",
      ":",
      $._tff_monotype,
    ),

    _tff_monotype: $ => choice(
      $.tff_atomic_type,
      seq(
        "(",
        $.tff_mapping_type,
      ")",
      ),
      $.tf1_quantified_type,
    ),

    _tff_unitary_type: $ => choice(
      $.tff_atomic_type,
      seq(
        "(",
        $.tff_xprod_type,
        ")",
      ),
    ),

    tff_atomic_type: $ => choice(
      $._atomic_word,
      $.tff_inbuilt_type,
      $.variable,
      seq(
        $._atomic_word,
        "(",
        $.tff_type_arguments,
      ")",
      ),
      seq(
        "(",
        $.tff_atomic_type,
        ")",
      ),
      $.txf_tuple_type,
    ),
    
    tff_inbuilt_type: $ => $.dollar_word,

    tff_type_arguments: $ => choice(
      $.tff_atomic_type,
      seq(
        $.tff_atomic_type,
        ",",
        $.tff_type_arguments,
      ),
    ),

    tff_mapping_type: $ => seq(
      $._tff_unitary_type,
      ">",
      $.tff_atomic_type,
    ),

    tff_xprod_type: $ => choice(
      seq(
        $._tff_unitary_type,
        "*",
        $.tff_atomic_type,
      ),
      seq(
        $.tff_xprod_type,
        "*",
        $.tff_atomic_type,
      ),
    ),

    txf_tuple_type: $ => seq(
      "[",
      $._tff_type_list,
      "]",
    ),

    _tff_type_list: $ => choice(
      $.tff_top_level_type,
      seq(
        $.tff_top_level_type,
        ",",
        $._tff_type_list,
      ),
    ),

    _tff_subtype: $ => seq(
      $.untyped_atom,
      "<<",
      $.atom,
    ),

    _txf_definition: $ => seq(
      $._tff_atomic_formula,
      "==",
      $.tff_term,
    ),

    _txf_sequent: $ => seq(
      $.txf_tuple,
      "-->",
      $.txf_tuple,
    ),

    _nhf_long_connective: $ => choice(
      seq(
        "{",
        $.def_or_sys_constant,
        "}",
      ),
      seq(
        "{",
        $.def_or_sys_constant,
        "(",
        $._nhf_parameter_list,
        ")",
        "}",
      ),
    ),

    _nhf_parameter_list: $ => choice(
      $._nhf_parameter,
      seq(
        $._nhf_parameter,
        ",",
        $._nhf_parameter_list,
      ),
    ),

    _nhf_parameter: $ => choice(
      $.ntf_index,
      $._thf_definition,
    ),
    
    _nxf_long_connective: $ => choice(
      seq(
        "{",
        $.def_or_sys_constant,
        "}",
      ),
      seq(
        "{",
        $.def_or_sys_constant,
        "(",
        $._nxf_parameter_list,
        ")",
        "}",
      ),
    ),

    _nxf_parameter_list: $ => choice(
      $._nxf_parameter,
      seq(
        $._nxf_parameter,
        ",",
        $._nxf_parameter_list,
      ),
    ),

    _nxf_parameter: $ => choice(
      $.ntf_index,
      $._txf_definition,
    ),
    
    ntf_index: $ => seq(
      "#",
      $._tff_unitary_term,
    ),

    _ntf_short_connective: $ => choice(
      seq(
        "[",
        ".",
        "]",
      ),
      seq(
        "<",
        ".",
        ">",
      ),
      seq(
        "{",
        ".",
        "}",
      ),
      seq(
        "(",
        ".",
        ")",
      ),
    ),

    tcf_formula: $ => choice(
      $._tcf_logic_formula,
      $._tff_atom_typing,
    ),

    _tcf_logic_formula: $ => choice(
      $._tcf_quantified_formula,
      $.cnf_formula,
    ),

    _tcf_quantified_formula: $ => seq(
      "!",
      "[",
      $._tff_variable_list,
      "]",
      ":",
      $._tcf_logic_formula,
    ),

    fof_formula: $ => choice(
      $._fof_logic_formula,
      $._fof_sequent,
    ),

    _fof_logic_formula: $ => choice(
      $.fof_binary_formula,
      $.fof_unary_formula,
      $.fof_unitary_formula,
    ),

    fof_binary_formula: $ => choice(
      $._fof_binary_nonassoc,
      $._fof_binary_assoc,
    ),

    _fof_binary_nonassoc: $ => seq(
      $._fof_unit_formula,
      $.nonassoc_connective,
      $._fof_unit_formula,
    ),

    _fof_binary_assoc: $ => choice(
      $._fof_or_formula,
      $._fof_and_formula,
    ),

    _fof_or_formula: $ => choice(
      seq(
        $._fof_unit_formula,
        "|",
        $._fof_unit_formula,
      ),
      seq(
        $._fof_or_formula,
        "|",
        $._fof_unit_formula,
      ),
    ),

    _fof_and_formula: $ => choice(
      seq(
        $._fof_unit_formula,
        "&",
        $._fof_unit_formula,
      ),
      seq(
        $._fof_and_formula,
        "&",
        $._fof_unit_formula,
      ),
    ),

    fof_unary_formula: $ => choice(
      seq(
        "~",
        $._fof_unit_formula,
      ),
      $._fof_infix_unary,
    ),

    _fof_infix_unary: $ => seq(
      $._fof_term,
      "!=",
      $._fof_term,
    ),

    _fof_unit_formula: $ => choice(
      $.fof_unitary_formula,
      $.fof_unary_formula,
    ),

    fof_unitary_formula: $ => choice(
      $._fof_quantified_formula,
      $.fof_atomic_formula,
      seq(
        "(",
        $._fof_logic_formula,
        ")",
      ),
    ),

    _fof_quantified_formula: $ => seq(
      $.fof_quantifier,
      "[",
      $._fof_variable_list,
      "]",
      ":",
      $._fof_unit_formula,
    ),

    _fof_variable_list: $ => choice(
      $.variable,
      seq(
        $.variable,
        ",",
        $._fof_variable_list,
      ),
    ),

    fof_atomic_formula: $ => choice(
      $._fof_plain_term,
      $.fof_defined_atomic_formula,
      $.fof_system_term,
    ),
    
    fof_defined_atomic_formula: $ => choice(
      $._fof_defined_plain_term,
      $._fof_defined_infix_formula,
    ),
    
    _fof_defined_infix_formula: $ => seq(
      $._fof_term,
      "=",
      $._fof_term,
    ),
    
    _fof_plain_term: $ => choice(
      $._atomic_word,
      seq(
        $._atomic_word,
        "(",
        $._fof_arguments,
        ")",
      ),
    ),

    fof_defined_term: $ => choice(
      $._defined_term,
      $._fof_defined_plain_term,
    ),
    
    _fof_defined_plain_term: $ => choice(
      $.dollar_word,
      seq(
        $.dollar_word,
        "(",
        $._fof_arguments,
        ")",
      ),
    ),

    fof_system_term: $ => choice(
      $.dollar_dollar_word,
      seq(
        $.dollar_dollar_word,
        "(",
        $._fof_arguments,
        ")",
      ),
    ),

    _fof_arguments: $ => choice(
      $._fof_term,
      seq(
        $._fof_term,
        ",",
        $._fof_arguments,
      ),
    ),

    _fof_term: $ => choice(
      $._fof_function_term,
      $.variable,
    ),

    _fof_function_term: $ => choice(
      $._fof_plain_term,
      $.fof_defined_term,
      $.fof_system_term,
    ),

    _fof_sequent: $ => choice(
      seq(
        $.fof_formula_tuple,
        "-->",
        $.fof_formula_tuple,
      ),
      seq(
        "(",
        $._fof_sequent,
        ")",
      ),
    ),

    fof_formula_tuple: $ => seq(
      "[",
      optional($.fof_formula_tuple_list),
      "]",
    ),

    fof_formula_tuple_list: $ => choice(
      $._fof_logic_formula,
      seq(
        $._fof_logic_formula,
        ",",
        $.fof_formula_tuple_list,
      ),
    ),

    cnf_formula: $ => choice(
      $.cnf_disjunction,
      seq(
        "(",
        $.cnf_formula,
        ")",
      ),
    ),

    cnf_disjunction: $ => choice(
      $.cnf_literal,
      seq(
        $.cnf_disjunction,
        "|",
        $.cnf_literal,
      ),
    ),

    cnf_literal: $ => choice(
      $.fof_atomic_formula,
      seq(
        "~",
        $.fof_atomic_formula,
      ),
      seq(
        "~",
        "(",
        $.fof_atomic_formula,
        ")",
      ),
      $._fof_infix_unary,
    ),

    thf_quantifier: $ => choice(
      $.tff_quantifier,
      $._th0_quantifier,
      $._th1_quantifier,
    ),

    thf_unary_connective: $ => choice(
      "~",
      $._ntf_short_connective,
    ),

    _th1_quantifier: $ => choice(
      "!>",
      "?*",
    ),

    _th0_quantifier: $ => choice(
      "^",
      "@+",
      "@-",
    ),
    
    tff_unary_connective: $ => choice(
      "~",
      $._ntf_short_connective,
    ),

    tff_quantifier: $ => choice(
      $.fof_quantifier,
      "#",
    ),

    fof_quantifier: $ => choice(
      "!",
      "?"
    ),

    nonassoc_connective: $ => choice(
      "<=>",
      "=>",
      "<=",
      "<~>",
      "~|",
      "~&",
    ),

    assoc_connective: $ => choice(
      "|",
      "&",
    ),

    
    atom: $ => choice(
      $.untyped_atom,
      $.dollar_word,
    ),

    untyped_atom: $ => choice(
      $._atomic_word,
      $.dollar_dollar_word,
    ),


    def_or_sys_constant: $ => choice(
      $.dollar_word,
      $.dollar_dollar_word,
    ),

    _th1_defined_term: $ => choice(
      "!!",
      "??",
      "@@+",
      "@@-",
      "@=",
    ),

    _defined_term: $ => choice(
      $.number,
      $.distinct_object,
    ),

    variable: $ => seq(
      /[A-Z]/,
      optional($.alpha_numeric),
    ),

    source_identifier: $ => choice(
      $.dag_source,
      $.internal_source,
      $.external_source,
      "unknown",
      seq(
        "[",
        $.source_identifiers,
        "]",
      ),
    ),

    source_identifiers: $ => choice(
      $.source_identifier,
      seq(
        $.source_identifier,
        ",",
        $.source_identifiers,
      ),
    ),

    dag_source: $ => choice(
      $.formula_name,
      $.inference_record,
    ),

    inference_record: $ => seq(
      "inference",
      "(",
      $._atomic_word,
      ",",
      $.general_list,
      ",",
      $.parents,
      ")",
    ),

    internal_source: $ => seq(
      "introduced",
      "(",
      $._atomic_word,
      ",",
      $.general_list,
      ",",
      $.parents,
      ")",
    ),

    external_source: $ => choice(
      $.file_source,
      $.theory,
      $.creator_source,
    ),

    file_source: $ => seq(
      "file",
      "(",
      $._atomic_word,
      ",",
      $.general_list,
      ")",
    ),

    file_info: $ => seq(
      ",",
      $.formula_name,
    ),

    theory: $ => seq(
      "theory",
      "(",
      $._atomic_word,
      ",",
      $.general_list,
      ")",
    ),

    
    creator_source: $ => seq(
      "creator",
      "(",
      $._atomic_word,
      ",",
      $.general_list,
      ",",
      $.parents,
      ")",
    ),
  
    parents: $ => seq(
      "[",
      optional($._parent_list),
      "]",
    ),


    _parent_list: $ => choice(
      $.parent_info,
      seq(
        $.parent_info,
        ",",
        $._parent_list,
      ),
    ),

    parent_info: $ => seq(
      $.source_identifier,
      optional($.parent_details),
    ),

    parent_details: $ => seq(
      ":",
      $.general_list,
    ),


    formula_selection: $ => choice(
      seq(
        "[",
        $._formula_name_list,
        "]",
      ),
      "*",
    ),

    _formula_name_list: $ => choice(
      $.formula_name,
      seq(
        $.formula_name,
        ",",
        $._formula_name_list,
      ),
    ),
    
    general_term: $ => choice(
      $.general_data,
      seq(
        $.general_data,
        ":",
        $.general_term,
      ),
      $.general_list,
    ),

    general_data: $ => choice(
      $._atomic_word,
      $.general_function,
      $.variable,
      $.number,
      $.distinct_object,
      $._formula_data,
    ),

    general_function: $ => seq(
      $._atomic_word,
      "(",
      $.general_terms,
      ")",
    ),

    _formula_data: $ => choice(
      seq(
        "$thf",
        "(",
        $.thf_formula,
        ")",
      ),
      seq(
        "$tff",
        "(",
        $.tff_formula,
        ")",
      ),
      seq(
        "$fof",
        "(",
        $.fof_formula,
        ")",
      ),
      seq(
        "$cnf",
        "(",
        $.cnf_formula,
        ")",
      ),
      seq(
        "$fot",
        "(",
        $._fof_term,
        ")",
      ),
    ),

    general_list: $ => seq(
      "[",
      optional($.general_terms),
      "]",
    ),

    general_terms: $ => choice(
      $.general_term,
      seq(
        $.general_term,
        ",",
        $.general_terms,
      ),
    ),

    formula_name: $ => choice(
      $._atomic_word,
      $.integer,
    ),

    _atomic_word: $ => choice(
      $.single_quoted,
      $._lower_word,
    ),

    number: $ => choice(
      $.integer,
      $.rational,
      $.real,
    ),

    _lower_word: $ => seq(
      /[a-z]/,
      optional($.alpha_numeric),
    ),
    
    _non_zero_numeric: $ => /[1-9]/,

    _numeric: $ => /[0-9]/,

    _positive_decimal: $ => seq(
      $._non_zero_numeric,
      repeat($._numeric)
    ),
    
    _decimal: $ => choice(
      "0",
      $._positive_decimal
    ),

    _dot_decimal: $ => seq(
      ".",
      repeat1($._numeric)
    ),

    _sign: $ => /[+-]/,

    integer: $ => seq(
      optional($._sign),
      $._decimal
    ),

    _decimal_fraction: $ => seq(
      $._decimal,
      $._dot_decimal
    ),

    _unsigned_exp_integer: $ => seq(
      repeat1($._numeric)
    ),

    _exp_integer: $ => seq(
      optional($._sign),
      $._unsigned_exp_integer
    ),
    
    _decimal_exponent: $ => seq(
      choice(
        $._decimal,
        $._decimal_fraction
      ),
      /[Ee]/,
      $._exp_integer
    ),

    _unsigned_real: $ => choice(
      $._decimal_fraction,
      $._decimal_exponent
    ),
    
    real: $ => seq(
      optional($._sign),
      $._unsigned_real
    ),

    _unsigned_rational: $ => seq(
      $._decimal,
      '/',
      $._positive_decimal
    ),
    
    rational: $ => seq(
      optional($._sign),
      $._unsigned_rational
    ),

    single_quoted: $ => token(
      /'[\x20\x24\x28-\x2F\x30-\x85\x87-\xB0]*'/,
    ),

    distinct_object: $ => token(
      /"([\x20\x24\x27-\x2F\x30-\x85\x87-\xB0]|[\\]|["\\])*"/,
    ),


    alpha_numeric: $ => token(/[a-zA-Z0-9_]+/),

    dollar_word: $ => seq(
      '$',
      choice(
        $.alpha_numeric,
        $.single_quoted
      )
    ),

    dollar_dollar_word: $ => seq(
      '$$',
      choice(
        $.alpha_numeric,
        $.single_quoted
      )
    ),




}});
