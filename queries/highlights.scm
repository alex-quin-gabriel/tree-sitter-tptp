
[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

[
  "."
  ","
  ":"
] @punctuation.delimiter

[
  (nonassoc_connective)
  (assoc_connective)
  (fof_quantifier)
  (thf_quantifier)
  (tff_unary_connective)
  (thf_unary_connective)
  "~"
  "|"
  "-->"
  "="
  "!="
  ":="
  "&"
  "!"
  "#"
  "=="
  "<<"
  "*"
  ">"
  "!>"
  "@"
  "+"
  "^"
] @operator



(line_comment) @comment @spell
(file_name) @string.special.path

(single_quoted) @string
(distinct_object) @string.special.symbol
(number) @number


(include) @function.builtin

;(annotated_formula) @function.builtin
(formula_name) @string.documentation
(formula_role) @type.builtin

(def_or_sys_constant) @function.builtin

; tff
(tff_defined_plain) @type.builtin
(tff_system_atomic) @function.builtin
(tff_plain_atomic) @function
(tff_atomic_type) @type ; types, e.g. in variable declaration
(tff_inbuilt_type) @type.builtin ; this catches $o and $i and $real and $tType
(tff_top_level_type) @type ; user defined top level types
; thf

; (thf_atomic_formula) @function ; all types

(thf_fof_function) @character

(thf_defined_atomic) @type.builtin ; this catches $o and $i and $real and $tType
(thf_defined_term) @function
(untyped_atom) @constant ; new type in type declaration
(thf_apply_formula) @function.method ; application of new types
(thf_top_level_type) @type ; user defined top level types





; fof
(fof_defined_atomic_formula) @function.builtin
(fof_defined_term) @function.builtin
(fof_system_term) @function.builtin


(variable) @variable




;(atom) @type



