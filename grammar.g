%parse-param env
%start program

%%

program
	: value EOF { return $1 }
	;

value
	: value atom -> $1($2)
	| atom
	;

atom
	: NUM -> Number($1)
	| ID -> env.get($1)
	| LPAREN value RPAREN -> $2
	;
