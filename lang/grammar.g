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
	| five
	;

declaration
	: LOCAL lookup -> af.declare($2)
	;

definition
	: LOCAL lookup EQUALS five -> af.define($2, $4)
	;

assignment
	: memory EQUALS five -> af.assign($1, $3)
	;

// post-composition
// P-combinator
five
	: AMP five -> af.debug($2)
	| six
	;

// composition
// B-combinator
six
	: six ARROW-OR-COMPOSE seven -> af.compose($1, $3)
	| seven
	;
	
// expr
// calls, T-combinator, A'-combinator
seven
	: seven eight -> af.expr($1, $2)
	| seven INFIX eight -> af.expr($3, $1)
	| seven BANGBANG eight -> af.apply($1, $3)
	| eight
	;

// invocation
// E-combinator
eight
	: eight BANG -> af.bangexpr($1)
	| nine
	;

// value
// literals, identifiers, E-combinator
nine
	: NUM -> af.number($1)
	| UNIT -> af.value(null)
	| STRING -> af.value(eval($1))
	| lambda
	| LANGLE array-contents RANGLE -> $2
	| memory
	| ten
	;

// atom
// parentheses
ten
	: LPAREN five RPAREN -> $2
	;

lookup
	: ID -> af.id($1)
	;

memory
	: lookup
	| nine DOT lookup -> af.access($1, $3, false)
	| nine DOT ten -> af.access($1, $3, true)
	;

array-contents
	: array-contents COMMA five -> af.arrayadd($1, $3)
	| five -> af.arrayadd(af.array, $1)
	| -> af.array
	;

lambda
	: LSQUARE id-list ARROW-OR-COMPOSE sequence RSQUARE -> af.fn($2, $4)
	| LSQUARE id-list COMMA sequence RSQUARE -> af.lambda($2, $4)
	| LSQUARE ARROW-OR-COMPOSE sequence RSQUARE -> af.thunk($3)
	;

id-list
	: id-list lookup -> $1.concat($2)
	| lookup -> [$1]
	;
