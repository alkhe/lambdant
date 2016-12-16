%parse-param af
%start program

%%

program
	: sequence EOF { return $1 }
	;

sequence
	: sequence SEQ statement -> ($1.exprs.push($3), $1)
	| statement -> af.seq($1)
	;

statement
	: LOCAL lookup EQUALS expr -> af.assign($2, $4)
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
	: NUM -> af.value(Number($1))
	| lookup
	| LPAREN expr RPAREN -> $2
	| lambda
	;

lambda
	: LSQUARE idlist ARROW expr RSQUARE -> af.fn($2, $4)
	;

idlist
	: idlist ID -> $1.concat($2)
	| ID -> [$1]
	;
