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
	| full
	;

declaration
	: LOCAL lookup -> af.declare($2)
	;

definition
	: LOCAL lookup EQUALS full -> af.define($2, $4)
	;

assignment
	: memory EQUALS full -> af.assign($1, $3)
	;

// base expression, zero precedence
full
	: four
	;

// post-composition
// P-combinator
four
	: AMP four -> af.debug($2)
	| five
	;

// composition
// B-combinator
five
	: five ARROW-OR-COMPOSE six -> af.compose($1, $3)
	| six
	;
	
// combination
// T-combinator, A'-combinator
six
	: six t-comb -> af.expr($2, $1)
	| six t-comb seven -> af.expr(af.expr($2, $1), $3)
	| six BANGBANG seven -> af.apply($1, $3)
	| seven
	;

// expr
// calls
seven
	: seven eight -> af.expr($1, $2)
	| eight
	;

t-comb
	: INFIX eight -> $2
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

memory
	: lookup
	| nine DOT lookup -> af.access($1, $3, false)
	| nine DOT ten -> af.access($1, $3, true)
	;

// atom
// parentheses
ten
	: LPAREN full RPAREN -> $2
	;

lookup
	: ID -> af.id($1)
	;

array-contents
	: array-contents COMMA full -> af.arrayadd($1, $3)
	| full -> af.arrayadd(af.array, $1)
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
