%parse-param af
%start program

%%

program
	: sequence EOF { return $1 }
	;

sequence
	: sequence SEQ statement -> ($1.exprs.push($3), $1)
	| sequence SEQ -> af.nullseq($1)
	| statement -> af.seq($1)
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

expr
	: expr value -> af.expr($1, $2)
	| expr INFIX value -> af.expr($3, $1)
	| value
	;

lookup
	: ID -> af.id($1)
	;

value
	: NUM -> af.value(Number($1))
	| UNIT -> af.value(null)
	| lookup
	| LPAREN expr RPAREN -> $2
	| lambda
	;

lambda
	: LSQUARE idlist ARROW sequence RSQUARE -> af.fn($2, $4)
	| LSQUARE ARROW sequence RSQUARE -> af.thunk($3)
	;

idlist
	: idlist ID -> $1.concat($2)
	| ID -> [$1]
	;
