%parse-param af
%start program

%%

program
	: sequence EOF { return $1 }
	;

sequence
	: normal-sequence
	| void-sequence
	;

normal-sequence
	: void-sequence statement -> af.seqadd($1, $2)
	;

void-sequence
	: -> af.nullseq
	| normal-sequence SEQ -> af.voidseq($1)
	;

statement
	: declaration
	| definition
	| assignment
	| expr
	;

declaration
	: LOCAL lookup -> af.declare($2)
	;

definition
	: LOCAL lookup EQUALS expr -> af.define($2, $4)
	;

assignment
	: lookup EQUALS expr -> af.assign($1, $3)
	;

call
	: expr value -> af.expr($1, $2)
	| expr BANG -> af.bangexpr($1)
	| AMP value -> af.debug($2)
	;

expr
	: call
	| expr INFIX value -> af.expr($3, $1)
	| value
	;

lookup
	: ID -> af.id($1)
	;

value
	: NUM -> af.number($1)
	| UNIT -> af.value(null)
	| STRING -> af.value(eval($1))
	| lookup
	| value ARROW-OR-ACCESS lookup -> af.access($1, $3, false)
	| LPAREN expr RPAREN -> $2
	| lambda
	;

lambda
	: LSQUARE id-list ARROW-OR-ACCESS sequence RSQUARE -> af.fn($2, $4)
	| LSQUARE ARROW-OR-ACCESS  sequence RSQUARE -> af.thunk($3)
	;

id-list
	: id-list lookup -> $1.concat($2)
	| lookup -> [$1]
	;
