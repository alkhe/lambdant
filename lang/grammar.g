%parse-param af
%start program

%left DOT
%left INFIX
%left COLON
%nonassoc AMP
%right QUESTION SOLIDUS
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
	| LOCAL object EQUALS full -> af.define($2, $4)
	| LOCAL array EQUALS full -> af.define($2, $4)
	;

assignment
	: lookup EQUALS full -> af.assign($1, $3)
	| member EQUALS full -> af.assign($1, $3)
	| object EQUALS full -> af.assign($1, $3)
	| array EQUALS full -> af.assign($1, $3)
	;

// base expression, zero precedence
full
	: three
	;


// post-conditional
// P-combinator
three
	: AMP four -> af.debug($2)
	| four
	;

// conditional
four
	: four QUESTION four SOLIDUS four -> af.conditional($1, $3, $5)
	| five
	;

// composition
// B-combinator
five
	: five COLON six -> af.compose($1, $3)
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
	| pattern
	| member
	| ten
	;

// expressions that are valid for assignments and arguments
pattern
	: lookup
	| object
	| array
	;

member
	: nine DOT lookup -> af.access($1, $3, false)
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

object
	: LBRACE object-entries RBRACE -> $2
	;

object-entries
	: object-entries COMMA object-entry -> af.objectadd($1, $3)
	| object-entry -> af.objectadd(af.object, $1)
	| -> af.object
	;

object-entry
	: lookup COLON full -> af.objectentry($1, $3, false)
	| ten COLON full -> af.objectentry($1, $3, true)
	| lookup -> af.shortentry($1)
	;

array
	: LANGLE array-contents RANGLE -> $2
	;

array-contents
	: array-contents COMMA full -> af.arrayadd($1, $3)
	| full -> af.arrayadd(af.array, $1)
	| -> af.array
	;

lambda
	: LSQUARE arg-list COLON sequence RSQUARE -> af.fn($2, $4)
	| LSQUARE arg-list COMMA sequence RSQUARE -> af.lambda($2, $4)
	| LSQUARE COLON sequence RSQUARE -> af.thunk($3)
	;

arg-list
	: arg-list pattern -> $1.concat($2)
	| pattern -> [$1]
	;
