[% USE raw %]
[% USE Koha %]
[% USE Branches %]
[% USE Categories %]
[% USE AuthClient %]
[% USE AdditionalContents %]
[% PROCESS 'i18n.inc' %]
[% PROCESS 'html_helpers.inc' %]
[% PROCESS 'shadcn-helpers.inc' %]
[% IF Koha.Preference( 'CookieConsent' ) %]
    [% USE JSConsents %]
[% END %]
[% SET OpacLangSelectorMode = Koha.Preference('OpacLangSelectorMode') %]
[% SET OpacHeader = AdditionalContents.get( location => "opacheader", lang => lang, library => logged_in_user.branchcode || default_branch, blocktitle => 0 ) %]
[% SET OpacCustomSearch = AdditionalContents.get( location => "OpacCustomSearch", lang => lang, library => logged_in_user.branchcode || default_branch, blocktitle => 0 ) %]
[% SET OpacLoginInstructions = AdditionalContents.get( location => "OpacLoginInstructions", lang => lang, library => branchcode || default_branch ) %]
[% SET OpacMoreSearches = AdditionalContents.get( location => "OpacMoreSearches", lang => lang, library => branchcode || default_branch ) %]
[% SET CookieConsentBar = AdditionalContents.get( location => "CookieConsentBar", lang => lang, library => branchcode || default_branch ) %]
[% SET CookieConsentPopup = AdditionalContents.get( location => "CookieConsentPopup", lang => lang, library => branchcode || default_branch ) %]
[% SET AllPublicBranches = Branches.all(  search_params => { public => 1 }, selected => opac_name ) %]

[% shadcn_button(
    text = "Skip to main content",
    id = "scrolltocontent",
    class = "skip-link",
    variant = "ghost",
    size = "sm"
) %]

<!-- closed in opac-bottom.inc -->
<div id="wrapper" class="shadcn-wrapper">
    <header id="header-region" class="main-header glass-effect" role="banner">
        <nav class="navbar" role="navigation" aria-label="Main navigation">
            <div class="navbar-container">
                <!-- Logo/Brand -->
                <div class="navbar-brand">
                    <a href="/cgi-bin/koha/opac-main.pl" class="brand-link">
                        [% IF ( LibraryNameTitle ) %]
                            [% LibraryNameTitle | html %]
                        [% ELSE %]
                            Koha online
                        [% END %]
                    </a>
                </div>

                [% IF ( OpacPublic ) %]
                    <!-- Cart Details -->
                    [% IF ( Koha.Preference( 'opacbookbag' ) == 1 ) %]
                        <div id="cartDetails" class="cart-notification">
                            <div class="notification-content">
                                <span class="notification-text">Your cart is empty.</span>
                            </div>
                        </div>
                    [% END %]

                    <!-- Main Navigation -->
                    <div class="navbar-nav">
                        [% IF ( Koha.Preference( 'opacbookbag' ) == 1 ) %]
                            [% shadcn_button(
                                text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#shopping-cart"></use></svg> <span class="nav-label">Cart</span> <span id="basketcount" class="badge badge-primary badge-sm"></span>',
                                href = "#",
                                variant = "ghost",
                                class = "nav-item js-show",
                                id = "cartmenulink"
                            ) %]
                        [% END %]

                        [% IF ( Koha.Preference( 'virtualshelves' ) == 1 ) %]
                            [% IF Koha.Preference( 'opacuserlogin' ) == 1 || some_public_shelves.count > 0 %]
                                <div class="dropdown">
                                    [% shadcn_button(
                                        text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#list"></use></svg> <span class="nav-label">Lists</span>',
                                        variant = "ghost",
                                        class = "dropdown-trigger",
                                        id = "listsmenu",
                                        onclick = "toggleDropdown('listsmenu')"
                                    ) %]
                                    <div class="dropdown-content glass-effect" id="listsmenu-dropdown">
                                        [% IF some_public_shelves.count %]
                                            <div class="dropdown-section">
                                                <h4 class="dropdown-header">Public lists</h4>
                                                [% SET number_of_public_shelves = 0 %]
                                                [% FOREACH s IN some_public_shelves %]
                                                    <a href="/cgi-bin/koha/opac-shelves.pl?op=view&amp;shelfnumber=[% s.shelfnumber | uri %]&amp;sortfield=[% s.sortfield | uri %]" class="dropdown-item">
                                                        [% s.shelfname | html %]
                                                    </a>
                                                    [% SET number_of_public_shelves = number_of_public_shelves + 1 %]
                                                    [% IF number_of_public_shelves >= 10 %][% LAST %][% END %]
                                                [% END %]
                                                [% IF some_public_shelves.count > 10 %]
                                                    <a href="/cgi-bin/koha/opac-shelves.pl?op=list&amp;public=1" class="dropdown-item text-primary">View all</a>
                                                [% END %]
                                            </div>
                                        [% END %]
                                        [% IF Koha.Preference( 'opacuserlogin' ) == 1 %]
                                            [% IF some_public_shelves.count > 0 %]
                                                <div class="dropdown-separator"></div>
                                            [% END %]
                                            <div class="dropdown-section">
                                                <h4 class="dropdown-header">Your lists</h4>
                                                [% IF loggedinusername %]
                                                    [% IF some_private_shelves.count %]
                                                        [% SET number_of_private_shelves = 0 %]
                                                        [% FOREACH s IN some_private_shelves %]
                                                            <a href="/cgi-bin/koha/opac-shelves.pl?op=view&amp;shelfnumber=[% s.shelfnumber | uri %]&amp;sortfield=[% s.sortfield | uri %]" class="dropdown-item">
                                                                [% s.shelfname | html %]
                                                            </a>
                                                            [% SET number_of_private_shelves = number_of_private_shelves + 1 %]
                                                            [% IF number_of_private_shelves >= 10 %][% LAST %][% END %]
                                                        [% END %]
                                                        [% IF some_private_shelves.count > 10 %]
                                                            <a href="/cgi-bin/koha/opac-shelves.pl?op=list&amp;public=0" class="dropdown-item text-primary">View all</a>
                                                        [% END %]
                                                    [% ELSE %]
                                                        <span class="dropdown-item text-muted">No private lists</span>
                                                    [% END %]
                                                    [% shadcn_button(
                                                        text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#plus"></use></svg> New list',
                                                        href = "/cgi-bin/koha/opac-shelves.pl?op=add_form",
                                                        variant = "primary",
                                                        size = "sm",
                                                        class = "dropdown-item-button"
                                                    ) %]
                                                [% ELSE %]
                                                    <a href="/cgi-bin/koha/opac-shelves.pl?op=add_form" class="dropdown-item">Log in to create your own lists</a>
                                                [% END %]
                                            </div>
                                        [% END %]
                                    </div>
                                </div>
                            [% END %]
                        [% END %]

                        [% IF Koha.Preference( 'OpacTrustedCheckout' ) %]
                            [% shadcn_button(
                                text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#credit-card"></use></svg> <span class="nav-label">Self checkout</span>',
                                variant = "ghost",
                                class = "nav-item",
                                id = "comenulink",
                                onclick = "openModal('checkoutModal')"
                            ) %]
                        [% END %]
                    </div>
                [% END %]

                <!-- Right Side Navigation -->
                <div class="navbar-actions">
                    [% IF ( ( opaclanguagesdisplay ) && ( ! one_language_enabled ) && ( languages_loop ) && ( OpacLangSelectorMode == 'both' || OpacLangSelectorMode == 'top') ) %]
                        [% context = "header" %]
                        [% INCLUDE 'langmenu.inc' %]
                    [% END %]

                    <!-- Theme Toggle -->
                    [% shadcn_theme_toggle(class = "navbar-theme-toggle") %]

                    <!-- User Menu -->
                    [% IF ( Koha.Preference( 'opacuserlogin' ) == 1 ) %]
                        <div class="dropdown user-menu">
                            [% IF ( loggedinusername ) %]
                                [% shadcn_button(
                                    text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#user"></use></svg> <span class="nav-label">Welcome, ' _ logged_in_user.firstname _ '</span>',
                                    variant = "ghost",
                                    class = "dropdown-trigger user-menu-trigger",
                                    id = "user-menu",
                                    onclick = "toggleDropdown('user-menu')"
                                ) %]
                                <div class="dropdown-content glass-effect" id="user-menu-dropdown">
                                    <div class="user-info">
                                        <div class="user-avatar">
                                            <svg class="icon feather-icon" aria-hidden="true"><use href="#user"></use></svg>
                                        </div>
                                        <div class="user-details">
                                            <div class="user-name">[% INCLUDE 'patron-title.inc' patron = logged_in_user no_html = 1 %]</div>
                                            <div class="user-library">[% logged_in_user.branchcode | html %]</div>
                                        </div>
                                    </div>
                                    <div class="dropdown-separator"></div>
                                    <a href="/cgi-bin/koha/opac-user.pl" class="dropdown-item">
                                        <svg class="icon feather-icon" aria-hidden="true"><use href="#user"></use></svg>
                                        Your account
                                    </a>
                                    [% IF Koha.Preference( 'EnableOpacSearchHistory' ) %]
                                        <a href="/cgi-bin/koha/opac-search-history.pl" class="dropdown-item">
                                            <svg class="icon feather-icon" aria-hidden="true"><use href="#clock"></use></svg>
                                            Search history
                                        </a>
                                    [% END %]
                                    <div class="dropdown-separator"></div>
                                    <a href="/cgi-bin/koha/opac-main.pl?logout.x=1" class="dropdown-item logout-item">
                                        <svg class="icon feather-icon" aria-hidden="true"><use href="#log-out"></use></svg>
                                        Log out
                                    </a>
                                </div>
                            [% ELSE %]
                                [% IF Koha.Preference('casAuthentication') %]
                                    [% shadcn_button(
                                        text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#log-in"></use></svg> <span class="nav-label">Log in</span>',
                                        href = "/cgi-bin/koha/opac-user.pl",
                                        variant = "primary",
                                        class = "login-button"
                                    ) %]
                                [% ELSIF ( Koha.Preference('GoogleOpenIDConnect') == 1 ) %]
                                    [% shadcn_button(
                                        text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#log-in"></use></svg> <span class="nav-label">Log in</span>',
                                        href = "/cgi-bin/koha/svc/auth/googleopenidconnect",
                                        variant = "primary",
                                        class = "login-button"
                                    ) %]
                                [% ELSE %]
                                    [% shadcn_button(
                                        text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#log-in"></use></svg> <span class="nav-label">Log in</span>',
                                        href = "/cgi-bin/koha/opac-user.pl",
                                        variant = "primary",
                                        class = "login-button loginModal-trigger"
                                    ) %]
                                [% END %]
                            [% END %]
                        </div>
                    [% END %]

                    <!-- Cookie Consent Button -->
                    [% IF !loggedinusername %]
                        [% shadcn_button(
                            text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#shield"></use></svg> <span class="nav-label">Your cookies</span>',
                            variant = "ghost",
                            class = "cookie-consent-button",
                            id = "cookieConsentButton",
                            onclick = "openCookieConsent()"
                        ) %]
                    [% END %]

                    <!-- Search History (for non-logged users) -->
                    [% IF OpacPublic && ( !Koha.Preference( 'opacuserlogin') || !loggedinusername ) %]
                        [% IF Koha.Preference( 'EnableOpacSearchHistory' ) %]
                            [% shadcn_button(
                                text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#calendar"></use></svg> <span class="nav-label">Search history</span>',
                                href = "/cgi-bin/koha/opac-search-history.pl",
                                variant = "ghost",
                                class = "search-history-button"
                            ) %]
                        [% END %]
                    [% END %]
                </div>
            </div>
        </nav>

        [% IF ( OpacHeader ) %]
            <div class="header-notice">
                [% PROCESS koha_news_block news => OpacHeader %]
            </div>
        [% END %]
    </header>

    [% IF ( OpacPublic ) %]
        <div class="search-section">
            [% UNLESS ( advsearch ) %]
                <div class="main-search-container">
                    [% shadcn_card(
                        variant = "glass",
                        class = "search-card",
                        body = BLOCK
                    ) %]
                        [% IF ( OpacCustomSearch ) %]
                            [% PROCESS koha_news_block news => OpacCustomSearch %]
                        [% ELSE %]
                            <form name="searchform" method="get" action="/cgi-bin/koha/opac-search.pl" id="searchform" class="search-form">
                                <div class="search-form-row">
                                    <div class="search-type-selector">
                                        <select name="idx" id="masthead_search" class="input input-select">
                                            [% IF ( ms_kw ) %]
                                                <option selected="selected" value="" data-placeholder="Search the catalog by keyword">Library catalog</option>
                                            [% ELSE %]
                                                <option value="" data-placeholder="Search the catalog by keyword">Library catalog</option>
                                            [% END %]
                                            [% IF ( ms_ti ) %]
                                                <option selected="selected" value="ti" data-placeholder="Search the catalog by title">Title</option>
                                            [% ELSE %]
                                                <option value="ti" data-placeholder="Search the catalog by title">Title</option>
                                            [% END %]
                                            [% IF ( ms_au ) %]
                                                <option selected="selected" value="au" data-placeholder="Search the catalog by author">Author</option>
                                            [% ELSE %]
                                                <option value="au" data-placeholder="Search the catalog by author">Author</option>
                                            [% END %]
                                            [% IF ( ms_su ) %]
                                                <option selected="selected" value="su" data-placeholder="Search the catalog by subject">Subject</option>
                                            [% ELSE %]
                                                <option value="su" data-placeholder="Search the catalog by subject">Subject</option>
                                            [% END %]
                                            [% IF ( ms_nb ) %]
                                                <option selected="selected" value="nb" data-placeholder="Search the catalog by ISBN">ISBN</option>
                                            [% ELSE %]
                                                <option value="nb" data-placeholder="Search the catalog by ISBN">ISBN</option>
                                            [% END %]
                                            [% IF ( ms_ns ) %]
                                                <option selected="selected" value="ns" data-placeholder="Search the catalog by ISSN">ISSN</option>
                                            [% ELSE %]
                                                <option value="ns" data-placeholder="Search the catalog by ISSN">ISSN</option>
                                            [% END %]
                                            [% IF ( ms_se ) %]
                                                <option selected="selected" value="se" data-placeholder="Search the catalog by series">Series</option>
                                            [% ELSE %]
                                                <option value="se" data-placeholder="Search the catalog by series">Series</option>
                                            [% END %]
                                            [% IF ( Koha.Preference('OPACNumbersPreferPhrase') ) %]
                                                [% IF ( ms_callnumcommaphr ) %]
                                                    <option selected="selected" value="callnum,phr" data-placeholder="Search the catalog by call number">Call number</option>
                                                [% ELSE %]
                                                    <option value="callnum,phr" data-placeholder="Search the catalog by call number">Call number</option>
                                                [% END %]
                                            [% ELSE %]
                                                [% IF ( ms_callnum ) %]
                                                    <option selected="selected" value="callnum" data-placeholder="Search the catalog by call number">Call number</option>
                                                [% ELSE %]
                                                    <option value="callnum" data-placeholder="Search the catalog by call number">Call number</option>
                                                [% END %]
                                            [% END %]
                                        </select>
                                    </div>

                                    <div class="search-input-container">
                                        [% IF ( !Koha.Preference( 'OpacAddMastheadLibraryPulldown' ) == 1 && mylibraryfirst ) %]
                                            <input type="text" 
                                                   class="input search-input" 
                                                   id="translControl1" 
                                                   name="q" 
                                                   value="[% ms_value | html %]" 
                                                   placeholder="Search the catalog by keyword"
                                                   title="Searching in [% Branches.GetName( mylibraryfirst ) | html %] only">
                                        [% ELSE %]
                                            <input type="text" 
                                                   class="input search-input" 
                                                   id="translControl1" 
                                                   name="q" 
                                                   value="[% ms_value | html %]" 
                                                   placeholder="Search the catalog by keyword">
                                        [% END %]
                                    </div>

                                    [% IF ( Koha.Preference( 'OpacAddMastheadLibraryPulldown' ) == 1 && AllPublicBranches.size > 1 ) %]
                                        <div class="library-selector">
                                            <select name="limit" id="select_library" class="input input-select">
                                                <option value="">All libraries</option>
                                                [% IF LibrarySearchGroups %]
                                                    <optgroup label="Libraries">
                                                        [% FOREACH library IN AllPublicBranches %]
                                                            [% IF library.selected %]
                                                                <option selected="selected" value="branch:[% library.branchcode | html %]">[% library.branchname | html %]</option>
                                                            [% ELSE %]
                                                                <option value="branch:[% library.branchcode | html %]">[% library.branchname | html %]</option>
                                                            [% END %]
                                                        [% END %]
                                                    </optgroup>
                                                    <optgroup label="Groups">
                                                        [% FOREACH lsg IN LibrarySearchGroups %]
                                                            [% IF 'multibranchlimit-' _ lsg.id == opac_name || lsg.id == opac_name %]
                                                                <option selected="selected" value="multibranchlimit:[% lsg.id | html %]">[% lsg.title | html %]</option>
                                                            [% ELSE %]
                                                                <option value="multibranchlimit:[% lsg.id | html %]">[% lsg.title | html %]</option>
                                                            [% END %]
                                                        [% END %]
                                                    </optgroup>
                                                [% ELSE %]
                                                    [% FOREACH library IN AllPublicBranches %]
                                                        [% IF library.selected %]
                                                            <option selected="selected" value="branch:[% library.branchcode | html %]">[% library.branchname | html %]</option>
                                                        [% ELSE %]
                                                            <option value="branch:[% library.branchcode | html %]">[% library.branchname | html %]</option>
                                                        [% END %]
                                                    [% END %]
                                                [% END %]
                                            </select>
                                        </div>
                                    [% ELSE %]
                                        [% IF ( opac_limit_override ) %]
                                            [% IF ( opac_search_limit ) %]
                                                [% IF ( multibranchlimit = opac_search_limit.match( 'branch:multibranchlimit-(\d+)' ) ) %]
                                                    <input name="limit" value="multibranchlimit:[% multibranchlimit.0 | html %]" type="hidden" />
                                                [% ELSE %]
                                                    <input name="limit" value="[% opac_search_limit | html %]" type="hidden" />
                                                [% END %]
                                            [% END %]
                                        [% ELSE %]
                                            [% IF ( mylibraryfirst ) %]
                                                <input name="limit" value="branch:[% mylibraryfirst | html %]" type="hidden" />
                                            [% END %]
                                        [% END %]
                                    [% END %]

                                    [% shadcn_button(
                                        text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#search"></use></svg>',
                                        type = "submit",
                                        variant = "primary",
                                        class = "search-submit-button",
                                        id = "searchsubmit"
                                    ) %]
                                </div>
                                <input type="hidden" name="weight_search" value="1" />
                            </form>
                        [% END %]
                    [% END %]
                </div>
            [% END %]

            <!-- Additional Search Options -->
            <div class="secondary-nav">
                <nav class="nav-links glass-effect" aria-label="Additional search options">
                    <a href="/cgi-bin/koha/opac-search.pl" class="nav-link">
                        <svg class="icon feather-icon" aria-hidden="true"><use href="#search"></use></svg>
                        Advanced search
                    </a>
                    [% IF ( Koha.Preference( 'UseCourseReserves' ) == 1 ) %]
                        <a href="/cgi-bin/koha/opac-course-reserves.pl" class="nav-link">
                            <svg class="icon feather-icon" aria-hidden="true"><use href="#book-open"></use></svg>
                            Course reserves
                        </a>
                    [% END %]
                    [% IF Koha.Preference( 'OpacBrowser' ) == 1 %]
                        <a href="/cgi-bin/koha/opac-browser.pl" class="nav-link">
                            <svg class="icon feather-icon" aria-hidden="true"><use href="#tree"></use></svg>
                            Browse by hierarchy
                        </a>
                    [% END %]
                    [% IF Koha.Preference( 'OpacAuthorities' ) == 1 %]
                        <a href="/cgi-bin/koha/opac-authorities-home.pl" class="nav-link">
                            <svg class="icon feather-icon" aria-hidden="true"><use href="#users"></use></svg>
                            Authority search
                        </a>
                    [% END %]
                    [% IF ( ( Koha.Preference( 'opacuserlogin' ) == 1 ) && ( Koha.Preference( 'OPACComments' ) == 1 ) && ( Koha.Preference( 'OpacShowRecentComments' ) == 1 ) ) %]
                        <a href="/cgi-bin/koha/opac-showreviews.pl" class="nav-link">
                            <svg class="icon feather-icon" aria-hidden="true"><use href="#message-circle"></use></svg>
                            Recent comments
                        </a>
                    [% END %]
                    [% IF Koha.Preference( 'TagsEnabled' ) == 1 %]
                        <a href="/cgi-bin/koha/opac-tags.pl" class="nav-link">
                            <svg class="icon feather-icon" aria-hidden="true"><use href="#tag"></use></svg>
                            Tag cloud
                        </a>
                    [% END %]
                    [% IF Koha.Preference( 'OpacCloud' ) == 1 %]
                        <a href="/cgi-bin/koha/opac-tags_subject.pl" class="nav-link">
                            <svg class="icon feather-icon" aria-hidden="true"><use href="#cloud"></use></svg>
                            Subject cloud
                        </a>
                    [% END %]
                    [% IF Koha.Preference( 'OpacTopissue' ) == 1 %]
                        <a href="/cgi-bin/koha/opac-topissues.pl" class="nav-link">
                            <svg class="icon feather-icon" aria-hidden="true"><use href="#trending-up"></use></svg>
                            Most popular
                        </a>
                    [% END %]
                    [% IF Koha.Preference('SearchEngine') == 'Elasticsearch' && Koha.Preference( 'OpacBrowseSearch' ) == 1 %]
                        <a href="/cgi-bin/koha/opac-browse.pl" class="nav-link">
                            <svg class="icon feather-icon" aria-hidden="true"><use href="#layers"></use></svg>
                            Browse search
                        </a>
                    [% END %]
                    [% IF suggestion %]
                        [% IF Koha.Preference( 'AnonSuggestions' ) == 1 || Koha.Preference( 'OPACViewOthersSuggestions' ) == 1 %]
                            <a href="/cgi-bin/koha/opac-suggestions.pl?suggested_by_anyone=1" class="nav-link">
                                <svg class="icon feather-icon" aria-hidden="true"><use href="#shopping-cart"></use></svg>
                                Purchase suggestions
                            </a>
                        [% END %]
                    [% END %]
                    [% IF ( Koha.Preference('OPACShowLibraries') && AllPublicBranches.size > 0 ) %]
                        <a href="/cgi-bin/koha/opac-library.pl" class="nav-link">
                            <svg class="icon feather-icon" aria-hidden="true"><use href="#map-pin"></use></svg>
                            [% IF ( singleBranchMode || AllPublicBranches.size == 1 ) %]
                                Contact
                            [% ELSE %]
                                Libraries
                            [% END %]
                        </a>
                    [% END %]
                    [% PROCESS koha_news_block news => OpacMoreSearches %]
                </nav>
            </div>
        </div>
    [% END %]
