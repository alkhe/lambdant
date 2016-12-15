%parse-param af
%start program

%%

program
	: expr EOF { return $1 }
	;

expr
	: expr value -> af.expr($1, $2)
	| value
	;

value
	: NUM -> af.value(Number($1))
	| ID -> af.id($1)
	| LPAREN expr RPAREN -> $2
	;
