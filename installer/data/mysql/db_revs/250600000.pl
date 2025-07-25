use Modern::Perl;
use utf8;
use Encode qw( encode_utf8 );

return {
    bug_number  => undef,
    description => 'Increase DBRev for 25.06',
    up          => sub {
        my ($args) = @_;
        my ( $dbh, $out ) = @$args{qw(dbh out)};
        say $out encode_utf8 "New cycle, let's go!!!";
    },
    }
