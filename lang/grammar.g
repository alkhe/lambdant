%parse-param af
%start program

%left DOT
%left INFIX
%left ARROW-OR-ACCESS
%nonassoc AMP
%nonassoc BANG

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
	| composition
	;

declaration
	: LOCAL lookup -> af.declare($2)
	;

definition
	: LOCAL lookup EQUALS composition -> af.define($2, $4)
	;

assignment
	: lookup EQUALS composition -> af.assign($1, $3)
	;

composition
	: composition ARROW-OR-COMPOSE expr -> af.compose($1, $3)
	| expr
	;
	
expr
	: expr value -> af.expr($1, $2)
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
	| lambda
	| LPAREN composition RPAREN -> $2
	| value BANG -> af.bangexpr($1)
	| AMP value -> af.debug($2)
	| value DOT lookup -> af.access($1, $3, false)
	;

lambda
	: LSQUARE id-list ARROW-OR-COMPOSE sequence RSQUARE -> af.fn($2, $4)
	| LSQUARE ARROW-OR-COMPOSE  sequence RSQUARE -> af.thunk($3)
	;

id-list
	: id-list lookup -> $1.concat($2)
	| lookup -> [$1]
	;
