[%# SHAD CN Template Integration: Core template helpers for SHAD CN components %]
[%# This file provides Template Toolkit macros for SHAD CN components %]

[%# Button Component Helper %]
[% MACRO shadcn_button(
    text = '',
    variant = 'primary',
    size = 'md',
    type = 'button',
    href = '',
    class = '',
    id = '',
    disabled = 0,
    icon = '',
    icon_position = 'left',
    onclick = '',
    data_attr = {}
) %]
    [% IF href %]
        <a href="[% href | url %]" 
           class="btn btn-[% variant %] [% IF size != 'md' %]btn-[% size %][% END %] [% class %]" 
           [% IF id %]id="[% id %]"[% END %]
           [% IF disabled %]aria-disabled="true"[% END %]
           [% FOREACH attr IN data_attr %]data-[% attr.key %]="[% attr.value | html %]"[% END %]>
            [% IF icon && icon_position == 'left' %]
                <svg class="icon icon-left feather-icon" aria-hidden="true"><use href="#[% icon %]"></use></svg>
            [% END %]
            [% text | html %]
            [% IF icon && icon_position == 'right' %]
                <svg class="icon icon-right feather-icon" aria-hidden="true"><use href="#[% icon %]"></use></svg>
            [% END %]
        </a>
    [% ELSE %]
        <button type="[% type %]" 
                class="btn btn-[% variant %] [% IF size != 'md' %]btn-[% size %][% END %] [% class %]" 
                [% IF id %]id="[% id %]"[% END %]
                [% IF disabled %]disabled[% END %]
                [% IF onclick %]onclick="[% onclick | html %]"[% END %]
                [% FOREACH attr IN data_attr %]data-[% attr.key %]="[% attr.value | html %]"[% END %]>
            [% IF icon && icon_position == 'left' %]
                <svg class="icon icon-left feather-icon" aria-hidden="true"><use href="#[% icon %]"></use></svg>
            [% END %]
            [% text | html %]
            [% IF icon && icon_position == 'right' %]
                <svg class="icon icon-right feather-icon" aria-hidden="true"><use href="#[% icon %]"></use></svg>
            [% END %]
        </button>
    [% END %]
[% END %]

[%# Card Component Helper %]
[% MACRO shadcn_card(
    variant = 'default',
    class = '',
    id = '',
    header = '',
    title = '',
    subtitle = '',
    body = '',
    footer = '',
    image = '',
    stats = {}
) %]
    <div class="card [% IF variant != 'default' %]card-[% variant %][% END %] [% class %]" [% IF id %]id="[% id %]"[% END %]>
        [% IF image %]
            <div class="card-image">
                <img src="[% image | url %]" alt="" loading="lazy">
            </div>
        [% END %]
        
        [% IF header || title || subtitle %]
            <div class="card-header">
                [% IF header %]
                    [% header %]
                [% ELSE %]
                    [% IF title %]
                        <h3 class="card-title">[% title | html %]</h3>
                    [% END %]
                    [% IF subtitle %]
                        <p class="card-subtitle">[% subtitle | html %]</p>
                    [% END %]
                [% END %]
            </div>
        [% END %]
        
        [% IF body %]
            <div class="card-body">
                [% body %]
            </div>
        [% END %]
        
        [% IF stats.keys.size > 0 %]
            <div class="card-stats">
                [% FOREACH stat IN stats %]
                    <div class="stat-item">
                        <span class="stat-value">[% stat.value | html %]</span>
                        <span class="stat-label">[% stat.label | html %]</span>
                    </div>
                [% END %]
            </div>
        [% END %]
        
        [% IF footer %]
            <div class="card-footer">
                [% footer %]
            </div>
        [% END %]
    </div>
[% END %]

[%# Form Input Helper %]
[% MACRO shadcn_input(
    type = 'text',
    name = '',
    id = '',
    value = '',
    placeholder = '',
    variant = 'default',
    class = '',
    required = 0,
    disabled = 0,
    readonly = 0,
    size = 'md',
    error = '',
    description = '',
    label = '',
    label_class = ''
) %]
    [% IF label %]
        <div class="form-group">
            <label for="[% id || name %]" class="form-label [% IF required %]required[% END %] [% label_class %]">
                [% label | html %]
            </label>
    [% END %]
    
    <input type="[% type %]" 
           [% IF name %]name="[% name %]"[% END %]
           [% IF id %]id="[% id %]"[% ELSIF name %]id="[% name %]"[% END %]
           [% IF value %]value="[% value | html %]"[% END %]
           [% IF placeholder %]placeholder="[% placeholder | html %]"[% END %]
           class="input [% IF variant != 'default' %]input-[% variant %][% END %] [% IF size != 'md' %]input-[% size %][% END %] [% class %]"
           [% IF required %]required[% END %]
           [% IF disabled %]disabled[% END %]
           [% IF readonly %]readonly[% END %]>
    
    [% IF description %]
        <div class="form-description">[% description | html %]</div>
    [% END %]
    
    [% IF error %]
        <div class="form-error" role="alert">[% error | html %]</div>
    [% END %]
    
    [% IF label %]
        </div>
    [% END %]
[% END %]

[%# Alert Component Helper %]
[% MACRO shadcn_alert(
    variant = 'default',
    title = '',
    message = '',
    icon = '',
    dismissible = 0,
    class = '',
    id = ''
) %]
    <div class="alert alert-[% variant %] [% IF icon %]alert-with-icon[% END %] [% class %]" 
         [% IF id %]id="[% id %]"[% END %]
         [% IF dismissible %]data-auto-dismiss="5000"[% END %]>
        [% IF icon %]
            <svg class="alert-icon icon feather-icon" aria-hidden="true"><use href="#[% icon %]"></use></svg>
        [% END %]
        
        [% IF title %]
            <div class="alert-title">[% title | html %]</div>
        [% END %]
        
        [% IF message %]
            <div class="alert-description">[% message | html %]</div>
        [% END %]
        
        [% IF dismissible %]
            <button type="button" class="alert-close" data-notification-dismiss aria-label="Close">
                <svg class="icon feather-icon" aria-hidden="true"><use href="#x"></use></svg>
            </button>
        [% END %]
    </div>
[% END %]

[%# Badge Component Helper %]
[% MACRO shadcn_badge(
    text = '',
    variant = 'default',
    outline = 0,
    class = '',
    id = ''
) %]
    <span class="badge badge-[% variant %] [% IF outline %]badge-outline[% END %] [% class %]" 
          [% IF id %]id="[% id %]"[% END %]>
        [% text | html %]
    </span>
[% END %]

[%# Navigation Helper %]
[% MACRO shadcn_nav_item(
    text = '',
    href = '',
    icon = '',
    badge = '',
    active = 0,
    class = '',
    id = ''
) %]
    <a href="[% href | url %]" 
       class="sidebar-nav-item [% IF active %]active[% END %] [% class %]"
       [% IF id %]id="[% id %]"[% END %]>
        [% IF icon %]
            <svg class="sidebar-nav-icon feather-icon" aria-hidden="true"><use href="#[% icon %]"></use></svg>
        [% END %]
        <span class="sidebar-nav-label">[% text | html %]</span>
        [% IF badge %]
            <span class="sidebar-nav-badge">[% badge | html %]</span>
        [% END %]
    </a>
[% END %]

[%# Breadcrumb Helper %]
[% MACRO shadcn_breadcrumb(items = []) %]
    <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol class="breadcrumb-list">
            [% FOREACH item IN items %]
                <li class="breadcrumb-item">
                    [% IF item.href && !item.active %]
                        <a href="[% item.href | url %]" class="breadcrumb-link">[% item.text | html %]</a>
                    [% ELSE %]
                        <span class="breadcrumb-link [% IF item.active %]active[% END %]">[% item.text | html %]</span>
                    [% END %]
                    [% UNLESS loop.last %]
                        <span class="breadcrumb-separator" aria-hidden="true">/</span>
                    [% END %]
                </li>
            [% END %]
        </ol>
    </nav>
[% END %]

[%# Theme Toggle Helper %]
[% MACRO shadcn_theme_toggle(class = '', id = 'theme-toggle') %]
    <button type="button" 
            class="icon-button [% class %]" 
            id="[% id %]"
            data-theme-toggle
            aria-label="Toggle theme">
        <svg class="icon feather-icon" aria-hidden="true">
            <use href="#sun" class="sun-icon"></use>
            <use href="#moon" class="moon-icon"></use>
        </svg>
    </button>
[% END %]

[%# Table Helper %]
[% MACRO shadcn_table(
    headers = [],
    rows = [],
    sortable = 0,
    selectable = 0,
    variant = 'default',
    size = 'md',
    class = '',
    id = ''
) %]
    <div class="table-wrapper [% IF variant != 'default' %]table-[% variant %][% END %]">
        <table class="table [% IF sortable %]table-sortable[% END %] [% IF selectable %]table-selectable[% END %] [% IF size != 'md' %]table-[% size %][% END %] [% class %]" 
               [% IF id %]id="[% id %]"[% END %]>
            <thead class="table-header">
                <tr class="table-header-row">
                    [% IF selectable %]
                        <th class="table-header-cell">
                            <input type="checkbox" class="table-checkbox" aria-label="Select all">
                        </th>
                    [% END %]
                    [% FOREACH header IN headers %]
                        <th class="table-header-cell [% IF sortable && header.sortable %]sortable[% END %]">
                            [% header.text | html %]
                        </th>
                    [% END %]
                </tr>
            </thead>
            <tbody class="table-body">
                [% FOREACH row IN rows %]
                    <tr class="table-row">
                        [% IF selectable %]
                            <td class="table-cell">
                                <input type="checkbox" class="table-checkbox" aria-label="Select row">
                            </td>
                        [% END %]
                        [% FOREACH cell IN row %]
                            <td class="table-cell [% cell.class %]">[% cell.content %]</td>
                        [% END %]
                    </tr>
                [% END %]
            </tbody>
        </table>
    </div>
[% END %]

[%# Modal Helper %]
[% MACRO shadcn_modal(
    id = '',
    title = '',
    body = '',
    footer = '',
    size = 'md',
    variant = 'default',
    class = ''
) %]
    <div class="dialog [% IF variant != 'default' %]dialog-[% variant %][% END %]" id="[% id %]" role="dialog" aria-labelledby="[% id %]-title" aria-hidden="true">
        <div class="dialog-content [% IF size != 'md' %]dialog-[% size %][% END %] [% class %]">
            <div class="dialog-header">
                <h2 class="dialog-title" id="[% id %]-title">[% title | html %]</h2>
                <button type="button" class="dialog-close" data-dialog-close aria-label="Close">
                    <svg class="icon feather-icon" aria-hidden="true"><use href="#x"></use></svg>
                </button>
            </div>
            
            [% IF body %]
                <div class="dialog-body">[% body %]</div>
            [% END %]
            
            [% IF footer %]
                <div class="dialog-footer">[% footer %]</div>
            [% END %]
        </div>
    </div>
[% END %]
