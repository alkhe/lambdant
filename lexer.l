id-base-char		[A-Za-z\!\@\#\$\%\^\&\*\_\=]
id-normal-char		{id-base-char} | {sign}
id-general-char		{id-normal-char} | {num}
num					[0-9]
id					{id-normal-char} {id-general-char}* {id-normal-char} {id-general-char}*
number				{sign}? {num}+ ('.' {num}+)?
sign				[\-\+]
arrow				\-\>

%%

\s+					/* skip whitespace */
{number}			return 'NUM'
{id}				return 'ID'
{arrow}				return 'ARROW'
'('					return 'LPAREN'
')'					return 'RPAREN'
<<EOF>>				return 'EOF'
.					return 'INVALID'
