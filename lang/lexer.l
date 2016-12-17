alpha				[A-Za-z\$]
sign				[\-\+]
num					[0-9]
arrow-or-compose	\:
infix				\*
seq					\;
local				\@
equals				\=
unit				\(\)

quote				\'
normal-char			[^\'\b\f\n\r\t\v]
escape-char			\\[\'\\bfnrtv]
string-char			{normal-char} | {escape-char}
string-tail			{string-char}* {quote}

scomment			\#
scomment-char		[^\n]
scomment-text		{scomment-char}*\n

id-base-char		{alpha} | {sign}
id-general-char		{id-base-char} | {num}
id					{id-base-char} {id-general-char}* {id-base-char}* {id-general-char}*
number				{sign}? {num}+ ('.' {num}+)?

%x scomment string

%%

\s+							/* skip whitespace */
{number}					return 'NUM'
{id}						return 'ID'
{arrow-or-compose}			return 'ARROW-OR-COMPOSE'
{infix}						return 'INFIX'
{seq}						return 'SEQ'
{local}						return 'LOCAL'
{unit}						return 'UNIT'
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
