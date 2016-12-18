word-char			[A-Za-z\_\$]
sign				[\-\+]
num					[0-9]

quote				\'
normal-char			[^\'\b\f\n\r\t\v]
escape-char			\\[\'\\bfnrtv]
string-char			{normal-char} | {escape-char}
string-tail			{string-char}* {quote}

scomment			\#
scomment-char		[^\n]
scomment-text		{scomment-char}*\n

id					{word-char} ({word-char} | {num})*
number				{sign}? {num}+ ('.' {num}+)?

%x scomment string

%%

\s+							/* skip whitespace */
{number}					return 'NUM'
{id}						return 'ID'
':'							return 'ARROW-OR-COMPOSE'
'*'							return 'INFIX'
';' 						return 'SEQ'
'@'							return 'LOCAL'
'()'						return 'UNIT'
'='							return 'EQUALS'
'.'							return 'DOT'
'!!'						return 'BANGBANG'
'!'							return 'BANG'
'&'							return 'AMP'
'('							return 'LPAREN'
')'							return 'RPAREN'
'['							return 'LSQUARE'
']'							return 'RSQUARE'
'<'							return 'LANGLE'
'>'							return 'RANGLE'
'{'							return 'LBRACE'
'}'							return 'RBRACE'
','							return 'COMMA'

{scomment}					this.begin('scomment')
<scomment>{scomment-text}	this.popState()

{quote}						this.begin('string')
<string>{string-tail}		%{
								this.popState()
								yytext = `'` + yytext
								return 'STRING'
							%}

<<EOF>>						return 'EOF'
.							return 'INVALID'
