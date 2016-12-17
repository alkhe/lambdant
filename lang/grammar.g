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
	: memory EQUALS composition -> af.assign($1, $3)
	;

composition
	: composition ARROW-OR-COMPOSE expr -> af.compose($1, $3)
	| expr
	;
	
expr
	: expr value -> af.expr($1, $2)
	| expr INFIX value -> af.expr($3, $1)
	| expr BANGBANG value -> af.apply($1, $3)
	| value
	;

lookup
	: ID -> af.id($1)
	;

memory
	: lookup
	| value DOT lookup -> af.access($1, $3, false)
	| value DOT atom -> af.access($1, $3, true)
	;

value
	: NUM -> af.number($1)
	| UNIT -> af.value(null)
	| STRING -> af.value(eval($1))
	| memory
	| lambda
	| value BANG -> af.bangexpr($1)
	| AMP value -> af.debug($2)
	| LANGLE array-contents RANGLE -> $2
	| atom
	;

atom
	: LPAREN composition RPAREN -> $2
	;

array-contents
	: array-contents COMMA expr -> af.arrayadd($1, $3)
	| expr -> af.arrayadd(af.array, $1)
	| -> af.array
	;

lambda
	: LSQUARE id-list ARROW-OR-COMPOSE sequence RSQUARE -> af.fn($2, $4)
	| LSQUARE ARROW-OR-COMPOSE sequence RSQUARE -> af.thunk($3)
	;

id-list
	: id-list lookup -> $1.concat($2)
	| lookup -> [$1]
	;
