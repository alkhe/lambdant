word-char			[A-Za-z\_\$]
num					[0-9]

quote				\'
normal-char			[^\'\b\f\n\r\t\v]
escape-char			\\[\'\\bfnrtv]
string-char			{normal-char} | {escape-char}
string-tail			{string-char}* {quote}

scomment			\#
scomment-char		[^\n]
scomment-text		{scomment-char}*\n

mcomment			\#\#
mcomment-char		[^\#]
mcomment-terminate	\# | ([^\n]* \n)
mcomment-text		{mcomment-char}* \# {mcomment-terminate}

id					{word-char} ({word-char} | {num})*
number				[\+\-]? {num}+ ('.' {num}+)?

%x scomment mcomment string

%%

\s+							/* skip whitespace */
{number}					return 'NUM'
{id}						return 'ID'
':'							return 'COLON'
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
'?'							return 'QUESTION'
'/'							return 'SOLIDUS'

{mcomment}					this.begin('mcomment')
<mcomment>{mcomment-text}	this.popState()

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
