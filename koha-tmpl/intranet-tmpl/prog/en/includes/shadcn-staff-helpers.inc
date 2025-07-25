[%# SHAD CN Staff Interface Components %]
[%# Advanced Template Toolkit helpers for staff interface %]

[%# Advanced Data Table Helper %]
[% MACRO shadcn_advanced_table(
    id = '',
    data = [],
    columns = [],
    searchable = 1,
    sortable = 1,
    selectable = 1,
    paginated = 1,
    exportable = 1,
    actions = [],
    filters = [],
    class = '',
    per_page = 25
) %]
    <div class="advanced-table [% class %]" [% IF id %]id="[% id %]"[% END %]>
        <!-- Table Toolbar -->
        <div class="table-toolbar">
            <div class="table-search">
                [% IF searchable %]
                    <svg class="table-search-icon feather-icon" aria-hidden="true"><use href="#search"></use></svg>
                    <input type="text" placeholder="Search..." class="table-search-input" />
                [% END %]
            </div>
            
            <div class="table-actions">
                [% IF exportable %]
                    [% shadcn_button(
                        text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#download"></use></svg> Export',
                        variant = "outline",
                        size = "sm",
                        class = "table-export-btn"
                    ) %]
                [% END %]
                
                [% IF filters.size > 0 %]
                    [% shadcn_button(
                        text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#filter"></use></svg> Filter',
                        variant = "outline",
                        size = "sm",
                        class = "table-filter-btn"
                    ) %]
                [% END %]
                
                [% FOREACH action IN actions %]
                    [% shadcn_button(
                        text = action.text,
                        variant = action.variant || "outline",
                        size = "sm",
                        class = "table-action-btn",
                        onclick = action.onclick
                    ) %]
                [% END %]
            </div>
        </div>
        
        <!-- Table Container -->
        <div class="table-container">
            <table class="table-advanced">
                <thead>
                    <tr>
                        [% IF selectable %]
                            <th class="table-select-header">
                                <input type="checkbox" class="table-select-all" aria-label="Select all rows" />
                            </th>
                        [% END %]
                        
                        [% FOREACH column IN columns %]
                            <th class="table-header-cell [% IF column.sortable %]sortable[% END %]">
                                [% IF column.sortable %]
                                    <div class="table-sort" data-column="[% column.key %]">
                                        <span>[% column.label | html %]</span>
                                        <svg class="table-sort-icon feather-icon" aria-hidden="true"><use href="#chevron-down"></use></svg>
                                    </div>
                                [% ELSE %]
                                    [% column.label | html %]
                                [% END %]
                            </th>
                        [% END %]
                        
                        [% IF actions.size > 0 %]
                            <th class="table-actions-header">Actions</th>
                        [% END %]
                    </tr>
                </thead>
                
                <tbody>
                    [% FOREACH row IN data %]
                        <tr class="table-row" data-id="[% row.id %]">
                            [% IF selectable %]
                                <td class="table-select-cell">
                                    <input type="checkbox" class="table-select-row" value="[% row.id %]" aria-label="Select row" />
                                </td>
                            [% END %]
                            
                            [% FOREACH column IN columns %]
                                <td class="table-cell [% column.class %]">
                                    [% IF column.type == 'link' %]
                                        <a href="[% row.${column.key}_url %]" class="table-link">
                                            [% row.${column.key} | html %]
                                        </a>
                                    [% ELSIF column.type == 'badge' %]
                                        [% shadcn_badge(
                                            text = row.${column.key},
                                            variant = row.${column.key}_variant || 'secondary'
                                        ) %]
                                    [% ELSIF column.type == 'date' %]
                                        [% row.${column.key} | $KohaDates %]
                                    [% ELSIF column.type == 'currency' %]
                                        [% row.${column.key} | $Price %]
                                    [% ELSE %]
                                        [% row.${column.key} | html %]
                                    [% END %]
                                </td>
                            [% END %]
                            
                            [% IF actions.size > 0 %]
                                <td class="table-actions-cell">
                                    <div class="table-row-actions">
                                        [% FOREACH action IN actions %]
                                            [% shadcn_button(
                                                text = action.text,
                                                variant = "ghost",
                                                size = "sm",
                                                href = action.href ? action.href.replace('{{id}}', row.id) : '',
                                                onclick = action.onclick ? action.onclick.replace('{{id}}', row.id) : ''
                                            ) %]
                                        [% END %]
                                    </div>
                                </td>
                            [% END %]
                        </tr>
                    [% END %]
                </tbody>
            </table>
        </div>
        
        <!-- Pagination -->
        [% IF paginated %]
            <div class="table-pagination">
                <div class="table-info">
                    Showing [% start_record %] to [% end_record %] of [% total_records %] entries
                </div>
                
                <div class="pagination-controls">
                    [% shadcn_button(
                        text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#chevron-left"></use></svg>',
                        variant = "outline",
                        size = "sm",
                        class = "pagination-btn",
                        data_attr = { action => 'prev' },
                        disabled = (current_page <= 1)
                    ) %]
                    
                    [% FOREACH page IN pagination_pages %]
                        [% shadcn_button(
                            text = page.number,
                            variant = page.current ? "primary" : "outline",
                            size = "sm",
                            class = "pagination-btn",
                            data_attr = { action => 'page', page => page.number }
                        ) %]
                    [% END %]
                    
                    [% shadcn_button(
                        text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#chevron-right"></use></svg>',
                        variant = "outline",
                        size = "sm",
                        class = "pagination-btn",
                        data_attr = { action => 'next' },
                        disabled = (current_page >= total_pages)
                    ) %]
                </div>
            </div>
        [% END %]
    </div>
[% END %]

[%# Statistics Dashboard Helper %]
[% MACRO shadcn_stats_dashboard(
    title = '',
    stats = [],
    period_selector = 1,
    export_options = 1,
    class = ''
) %]
    <div class="dashboard-container [% class %]">
        [% IF title %]
            <div class="dashboard-header">
                <h2 class="dashboard-title">[% title | html %]</h2>
                <div class="dashboard-controls">
                    [% IF period_selector %]
                        <select class="input input-select dashboard-period-select">
                            <option value="7d">Last 7 days</option>
                            <option value="30d" selected>Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                    [% END %]
                    
                    [% IF export_options %]
                        [% shadcn_button(
                            text = '<svg class="icon feather-icon" aria-hidden="true"><use href="#download"></use></svg> Export',
                            variant = "outline",
                            size = "sm",
                            class = "dashboard-export-btn"
                        ) %]
                    [% END %]
                </div>
            </div>
        [% END %]
        
        <div class="stats-grid">
            [% FOREACH stat IN stats %]
                <div class="stat-card">
                    <div class="stat-header">
                        <div class="stat-icon-container">
                            [% IF stat.icon %]
                                <svg class="stat-icon feather-icon" aria-hidden="true"><use href="#[% stat.icon %]"></use></svg>
                            [% END %]
                        </div>
                        [% IF stat.trend %]
                            <div class="stat-trend [% stat.trend_type || 'neutral' %]">
                                [% IF stat.trend_type == 'positive' %]
                                    <svg class="icon feather-icon" aria-hidden="true"><use href="#trending-up"></use></svg>
                                [% ELSIF stat.trend_type == 'negative' %]
                                    <svg class="icon feather-icon" aria-hidden="true"><use href="#trending-down"></use></svg>
                                [% END %]
                                [% stat.trend %]
                            </div>
                        [% END %]
                    </div>
                    
                    <div class="stat-value">[% stat.value | html %]</div>
                    <div class="stat-label">[% stat.label | html %]</div>
                    
                    [% IF stat.description %]
                        <div class="stat-description">[% stat.description | html %]</div>
                    [% END %]
                    
                    [% IF stat.progress %]
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" data-progress="[% stat.progress %]%"></div>
                            </div>
                            <div class="progress-text">
                                <span>Progress</span>
                                <span>[% stat.progress %]%</span>
                            </div>
                        </div>
                    [% END %]
                </div>
            [% END %]
        </div>
    </div>
[% END %]

[%# Chart Component Helper %]
[% MACRO shadcn_chart(
    id = '',
    title = '',
    type = 'line',
    data = {},
    controls = [],
    height = '400px',
    class = ''
) %]
    <div class="chart-container [% class %]" [% IF id %]id="[% id %]"[% END %] style="height: [% height %];">
        <div class="chart-header">
            <h3 class="chart-title">[% title | html %]</h3>
            <div class="chart-controls">
                [% FOREACH control IN controls %]
                    [% shadcn_button(
                        text = control.text,
                        variant = control.active ? "primary" : "outline",
                        size = "sm",
                        class = "chart-control",
                        data_attr = { action => control.action, value => control.value }
                    ) %]
                [% END %]
            </div>
        </div>
        
        <div class="chart-canvas" data-chart-type="[% type %]" data-chart-data="[% data | json %]">
            <!-- Chart will be rendered here by JavaScript -->
        </div>
    </div>
[% END %]

[%# File Upload Component %]
[% MACRO shadcn_file_upload(
    id = '',
    name = '',
    accept = '',
    multiple = 0,
    max_size = '',
    label = '',
    description = '',
    class = ''
) %]
    <div class="file-upload-container [% class %]" [% IF id %]id="[% id %]"[% END %]>
        [% IF label %]
            <label class="file-upload-label">[% label | html %]</label>
        [% END %]
        
        <div class="file-upload-area">
            <input type="file" 
                   class="file-upload-input" 
                   [% IF name %]name="[% name %]"[% END %]
                   [% IF accept %]accept="[% accept %]"[% END %]
                   [% IF multiple %]multiple[% END %]
                   [% IF max_size %]data-max-size="[% max_size %]"[% END %] />
            
            <div class="file-upload-prompt">
                <svg class="file-upload-icon feather-icon" aria-hidden="true"><use href="#upload"></use></svg>
                <div class="file-upload-text">
                    <strong>Drop files here or click to browse</strong>
                    [% IF description %]
                        <p class="file-upload-description">[% description | html %]</p>
                    [% END %]
                </div>
            </div>
        </div>
        
        <div class="file-upload-progress" style="display: none;">
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%;"></div>
            </div>
            <div class="progress-text">
                <span class="progress-status">Uploading...</span>
                <span class="progress-percentage">0%</span>
            </div>
        </div>
        
        <div class="file-upload-files"></div>
    </div>
[% END %]

[%# Advanced Form Helper %]
[% MACRO shadcn_form_builder(
    id = '',
    method = 'post',
    action = '',
    fields = [],
    sections = [],
    class = ''
) %]
    <form [% IF id %]id="[% id %]"[% END %] 
          method="[% method %]" 
          [% IF action %]action="[% action %]"[% END %]
          class="advanced-form [% class %]">
        
        [% IF sections.size > 0 %]
            [% FOREACH section IN sections %]
                <div class="form-section">
                    [% IF section.title %]
                        <h3 class="form-section-title">[% section.title | html %]</h3>
                    [% END %]
                    
                    [% IF section.description %]
                        <p class="form-section-description">[% section.description | html %]</p>
                    [% END %]
                    
                    <div class="form-fields">
                        [% FOREACH field IN section.fields %]
                            [% PROCESS render_form_field field = field %]
                        [% END %]
                    </div>
                </div>
            [% END %]
        [% ELSE %]
            <div class="form-fields">
                [% FOREACH field IN fields %]
                    [% PROCESS render_form_field field = field %]
                [% END %]
            </div>
        [% END %]
    </form>
[% END %]

[%# Form Field Renderer %]
[% BLOCK render_form_field %]
    [% IF field.type == 'text' || field.type == 'email' || field.type == 'password' || field.type == 'number' %]
        [% shadcn_input(
            type = field.type,
            name = field.name,
            id = field.id,
            label = field.label,
            placeholder = field.placeholder,
            value = field.value,
            required = field.required,
            disabled = field.disabled,
            class = field.class,
            description = field.description
        ) %]
    [% ELSIF field.type == 'textarea' %]
        <div class="form-group">
            [% IF field.label %]
                <label for="[% field.id || field.name %]" class="form-label [% IF field.required %]required[% END %]">
                    [% field.label | html %]
                </label>
            [% END %]
            
            <textarea name="[% field.name %]" 
                      [% IF field.id %]id="[% field.id %]"[% END %]
                      class="input textarea [% field.class %]"
                      [% IF field.placeholder %]placeholder="[% field.placeholder | html %]"[% END %]
                      [% IF field.required %]required[% END %]
                      [% IF field.disabled %]disabled[% END %]
                      [% IF field.rows %]rows="[% field.rows %]"[% END %]>[% field.value | html %]</textarea>
            
            [% IF field.description %]
                <div class="form-description">[% field.description | html %]</div>
            [% END %]
        </div>
    [% ELSIF field.type == 'select' %]
        <div class="form-group">
            [% IF field.label %]
                <label for="[% field.id || field.name %]" class="form-label [% IF field.required %]required[% END %]">
                    [% field.label | html %]
                </label>
            [% END %]
            
            <select name="[% field.name %]" 
                    [% IF field.id %]id="[% field.id %]"[% END %]
                    class="input input-select [% field.class %]"
                    [% IF field.required %]required[% END %]
                    [% IF field.disabled %]disabled[% END %]>
                [% FOREACH option IN field.options %]
                    <option value="[% option.value | html %]" [% IF option.selected %]selected[% END %]>
                        [% option.label | html %]
                    </option>
                [% END %]
            </select>
            
            [% IF field.description %]
                <div class="form-description">[% field.description | html %]</div>
            [% END %]
        </div>
    [% ELSIF field.type == 'checkbox' %]
        <div class="form-group">
            <label class="form-checkbox-label">
                <input type="checkbox" 
                       name="[% field.name %]" 
                       [% IF field.id %]id="[% field.id %]"[% END %]
                       class="input input-checkbox [% field.class %]"
                       value="[% field.value || 1 %]"
                       [% IF field.checked %]checked[% END %]
                       [% IF field.required %]required[% END %]
                       [% IF field.disabled %]disabled[% END %] />
                <span class="checkbox-text">[% field.label | html %]</span>
            </label>
            
            [% IF field.description %]
                <div class="form-description">[% field.description | html %]</div>
            [% END %]
        </div>
    [% ELSIF field.type == 'file' %]
        [% shadcn_file_upload(
            id = field.id,
            name = field.name,
            accept = field.accept,
            multiple = field.multiple,
            max_size = field.max_size,
            label = field.label,
            description = field.description,
            class = field.class
        ) %]
    [% END %]
[% END %]

[%# Dashboard Widget Helper %]
[% MACRO shadcn_dashboard_widget(
    id = '',
    title = '',
    type = 'default',
    content = '',
    actions = [],
    class = ''
) %]
    <div class="dashboard-widget [% class %]" 
         [% IF id %]id="[% id %]"[% END %]
         data-type="[% type %]">
        <div class="widget-header">
            <h3 class="widget-title">[% title | html %]</h3>
            [% IF actions.size > 0 %]
                <div class="widget-menu">
                    <button class="widget-menu-btn" type="button">
                        <svg class="icon feather-icon" aria-hidden="true"><use href="#more-horizontal"></use></svg>
                    </button>
                    <div class="widget-menu-dropdown">
                        [% FOREACH action IN actions %]
                            <a href="[% action.href %]" class="widget-menu-item">
                                [% IF action.icon %]
                                    <svg class="icon feather-icon" aria-hidden="true"><use href="#[% action.icon %]"></use></svg>
                                [% END %]
                                [% action.text | html %]
                            </a>
                        [% END %]
                    </div>
                </div>
            [% END %]
        </div>
        
        <div class="widget-content">
            [% content %]
        </div>
    </div>
[% END %]
