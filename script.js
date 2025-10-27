// Azure Resource Graph Explorer - D3 Force Directed Visualization
class AzureResourceGraphExplorer {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.svg = null;
        this.simulation = null;
        this.nodes = [];
        this.links = [];
        this.tooltip = null;
        this.transform = d3.zoomIdentity;
        
        this.init();
        this.generateSampleData();
        this.createVisualization();
        this.setupEventListeners();
    }

    init() {
        // Create tooltip
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip');

        // Set up container dimensions
        this.updateDimensions();
        window.addEventListener('resize', () => this.updateDimensions());
    }

    updateDimensions() {
        const container = document.getElementById('graph-container');
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        
        if (this.svg) {
            this.svg.attr('width', this.width).attr('height', this.height);
            this.simulation?.force('center', d3.forceCenter(this.width / 2, this.height / 2));
        }
    }

    generateSampleData() {
        // Generate sample Azure resource data with authentic Azure resource types
        const resourceTypes = [
            { name: 'Virtual Machine', icon: '🖥️', category: 'Compute' },
            { name: 'App Service', icon: '🌐', category: 'Web' },
            { name: 'Function App', icon: '⚡', category: 'Compute' },
            { name: 'Storage Account', icon: '💾', category: 'Storage' },
            { name: 'Blob Storage', icon: '📦', category: 'Storage' },
            { name: 'SQL Database', icon: '🗃️', category: 'Database' },
            { name: 'Cosmos DB', icon: '🌍', category: 'Database' },
            { name: 'Virtual Network', icon: '🔗', category: 'Networking' },
            { name: 'Load Balancer', icon: '⚖️', category: 'Networking' },
            { name: 'Application Gateway', icon: '🚪', category: 'Networking' },
            { name: 'Key Vault', icon: '🔐', category: 'Security' },
            { name: 'Network Security Group', icon: '🛡️', category: 'Security' },
            { name: 'Public IP', icon: '🌐', category: 'Networking' },
            { name: 'Container Registry', icon: '📋', category: 'Containers' },
            { name: 'Kubernetes Service', icon: '☸️', category: 'Containers' },
            { name: 'Redis Cache', icon: '⚡', category: 'Database' }
        ];

        const resourceGroups = ['rg-production', 'rg-development', 'rg-staging', 'rg-shared', 'rg-networking'];
        const locations = ['East US', 'West US 2', 'Central US', 'North Europe', 'Southeast Asia'];
        const subscriptions = ['Production Subscription', 'Development Subscription', 'Shared Services'];

        // Create nodes (resources)
        this.nodes = [];
        for (let i = 0; i < 65; i++) {
            const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
            const resourceGroup = resourceGroups[Math.floor(Math.random() * resourceGroups.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const subscription = subscriptions[Math.floor(Math.random() * subscriptions.length)];
            
            // Determine status with realistic distribution
            let status = 'Running';
            const rand = Math.random();
            if (rand < 0.05) status = 'Stopped';
            else if (rand < 0.1) status = 'Warning';
            
            this.nodes.push({
                id: `resource-${i}`,
                name: `${resourceType.name.toLowerCase().replace(/\s+/g, '-')}-${i.toString().padStart(3, '0')}`,
                displayName: `${resourceType.name.replace(/\s+/g, '')}${i.toString().padStart(3, '0')}`,
                type: resourceType.name,
                icon: resourceType.icon,
                category: resourceType.category,
                resourceGroup: resourceGroup,
                location: location,
                subscription: subscription,
                status: status,
                group: Math.floor(i / 12), // For grouping nodes visually
                tags: this.generateTags()
            });
        }

        // Create more realistic links based on Azure resource relationships
        this.links = [];
        this.createRealisticConnections();
    }

    generateTags() {
        const possibleTags = [
            { key: 'Environment', values: ['Production', 'Development', 'Staging', 'Test'] },
            { key: 'Owner', values: ['TeamA', 'TeamB', 'TeamC', 'Shared'] },
            { key: 'CostCenter', values: ['CC001', 'CC002', 'CC003'] },
            { key: 'Project', values: ['ProjectAlpha', 'ProjectBeta', 'ProjectGamma'] }
        ];
        
        const tags = {};
        const numTags = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numTags; i++) {
            const tag = possibleTags[Math.floor(Math.random() * possibleTags.length)];
            const value = tag.values[Math.floor(Math.random() * tag.values.length)];
            tags[tag.key] = value;
        }
        
        return tags;
    }

    createRealisticConnections() {
        // Create realistic Azure resource relationships
        this.nodes.forEach((node, index) => {
            let connectionCount = 0;
            const maxConnections = this.getMaxConnections(node.type);
            
            // Connect to related resources in the same resource group
            const sameRgNodes = this.nodes.filter(n => 
                n.resourceGroup === node.resourceGroup && n.id !== node.id
            );
            
            sameRgNodes.forEach(targetNode => {
                if (connectionCount < maxConnections && this.shouldConnect(node, targetNode)) {
                    this.links.push({
                        source: node.id,
                        target: targetNode.id,
                        type: this.getConnectionType(node, targetNode),
                        strength: this.getConnectionStrength(node, targetNode)
                    });
                    connectionCount++;
                }
            });
            
            // Add some cross-resource group connections for shared services
            if (connectionCount < maxConnections && Math.random() > 0.7) {
                const crossRgNodes = this.nodes.filter(n => 
                    n.resourceGroup !== node.resourceGroup && 
                    (n.type === 'Virtual Network' || n.type === 'Key Vault' || node.type === 'Virtual Network')
                );
                
                if (crossRgNodes.length > 0) {
                    const targetNode = crossRgNodes[Math.floor(Math.random() * crossRgNodes.length)];
                    this.links.push({
                        source: node.id,
                        target: targetNode.id,
                        type: 'cross-rg',
                        strength: 0.3
                    });
                }
            }
        });

        // Remove duplicate links
        const linkSet = new Set();
        this.links = this.links.filter(link => {
            const linkId = `${link.source}-${link.target}`;
            const reverseLinkId = `${link.target}-${link.source}`;
            if (linkSet.has(linkId) || linkSet.has(reverseLinkId)) {
                return false;
            }
            linkSet.add(linkId);
            return true;
        });
    }

    getMaxConnections(resourceType) {
        const connectionLimits = {
            'Virtual Network': 8,
            'Load Balancer': 6,
            'Application Gateway': 5,
            'Virtual Machine': 4,
            'App Service': 3,
            'SQL Database': 3,
            'Key Vault': 6,
            'Storage Account': 4
        };
        return connectionLimits[resourceType] || 2;
    }

    shouldConnect(node1, node2) {
        // Define realistic Azure resource connection patterns
        const connectionRules = {
            'Virtual Machine': ['Virtual Network', 'Storage Account', 'Load Balancer', 'Network Security Group'],
            'App Service': ['SQL Database', 'Storage Account', 'Key Vault', 'Application Gateway'],
            'Function App': ['Storage Account', 'Key Vault', 'Cosmos DB', 'App Service'],
            'SQL Database': ['App Service', 'Virtual Machine', 'Key Vault'],
            'Load Balancer': ['Virtual Machine', 'Virtual Network'],
            'Application Gateway': ['App Service', 'Virtual Machine', 'Virtual Network'],
            'Storage Account': ['Virtual Machine', 'App Service', 'Function App'],
            'Key Vault': ['App Service', 'Function App', 'Virtual Machine', 'SQL Database'],
            'Virtual Network': ['Virtual Machine', 'Load Balancer', 'Application Gateway', 'Network Security Group'],
            'Network Security Group': ['Virtual Network', 'Virtual Machine']
        };
        
        const rules1 = connectionRules[node1.type] || [];
        const rules2 = connectionRules[node2.type] || [];
        
        return rules1.includes(node2.type) || rules2.includes(node1.type) || Math.random() > 0.8;
    }

    getConnectionType(node1, node2) {
        if (node1.type === 'Virtual Network' || node2.type === 'Virtual Network') return 'network';
        if (node1.type === 'Key Vault' || node2.type === 'Key Vault') return 'security';
        if (node1.resourceGroup === node2.resourceGroup) return 'same-rg';
        return 'dependency';
    }

    getConnectionStrength(node1, node2) {
        if (node1.resourceGroup === node2.resourceGroup) return 0.8;
        if (node1.type === 'Virtual Network' || node2.type === 'Virtual Network') return 0.9;
        return 0.5;
    }

    createVisualization() {
        const container = d3.select('#graph-container');
        container.selectAll('*').remove(); // Clear previous content

        // Create SVG
        this.svg = container
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Create zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.transform = event.transform;
                this.g.attr('transform', this.transform);
            });

        this.svg.call(zoom);

        // Create main group for zoomable content
        this.g = this.svg.append('g');

        // Create force simulation with improved forces
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(d => {
                // Variable distance based on connection type
                if (d.type === 'network') return 60;
                if (d.type === 'same-rg') return 80;
                if (d.type === 'security') return 70;
                return 100;
            }).strength(d => d.strength || 0.5))
            .force('charge', d3.forceManyBody().strength(d => {
                // Different charge based on resource type
                if (d.type === 'Virtual Network') return -400;
                if (d.category === 'Database') return -250;
                return -200;
            }))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(d => {
                // Different collision radius based on importance
                if (d.type === 'Virtual Network') return 35;
                if (d.category === 'Database') return 30;
                return 25;
            }))
            .force('x', d3.forceX(this.width / 2).strength(0.1))
            .force('y', d3.forceY(this.height / 2).strength(0.1));

        // Create links with improved styling
        const link = this.g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(this.links)
            .join('line')
            .attr('class', 'link')
            .attr('stroke', d => this.getLinkColor(d))
            .attr('stroke-width', d => this.getLinkWidth(d))
            .attr('stroke-opacity', 0.6)
            .attr('stroke-dasharray', d => d.type === 'cross-rg' ? '5,5' : 'none');

        // Create node groups
        const nodeGroup = this.g.append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(this.nodes)
            .join('g')
            .attr('class', 'node-group')
            .call(this.drag(this.simulation));

        // Add background circles
        const nodeBackground = nodeGroup.append('circle')
            .attr('class', 'node-background')
            .attr('r', d => this.getNodeSize(d))
            .attr('fill', d => this.getNodeColor(d));

        // Add resource icons using text (emojis work universally)
        const nodeIcon = nodeGroup.append('text')
            .attr('class', 'node-icon')
            .attr('fill', 'white')
            .text(d => d.icon)
            .style('font-size', d => (this.getNodeSize(d) * 0.8) + 'px');

        // Add status indicators
        const statusIndicator = nodeGroup.append('circle')
            .attr('class', 'status-indicator')
            .attr('r', 4)
            .attr('cx', d => this.getNodeSize(d) * 0.7)
            .attr('cy', d => -this.getNodeSize(d) * 0.7)
            .attr('fill', d => this.getStatusColor(d.status))
            .attr('stroke', 'white')
            .attr('stroke-width', 1);

        // Add node labels with improved positioning
        const labels = this.g.append('g')
            .attr('class', 'labels')
            .selectAll('text')
            .data(this.nodes)
            .join('text')
            .attr('class', 'node-label')
            .text(d => {
                const maxLength = 14;
                return d.displayName.length > maxLength ? 
                    d.displayName.substring(0, maxLength - 3) + '...' : 
                    d.displayName;
            })
            .attr('dy', d => this.getNodeSize(d) + 15);

        // Add hover effects with improved interactivity
        nodeGroup
            .on('mouseover', (event, d) => {
                this.showTooltip(event, d);
                this.highlightConnectedNodes(d, nodeGroup, link);
                // Scale up the hovered node
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('transform', 'scale(1.2)');
            })
            .on('mousemove', (event) => {
                this.tooltip
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on('mouseout', (event) => {
                this.hideTooltip();
                this.removeHighlights(nodeGroup, link);
                // Scale back to normal
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('transform', 'scale(1)');
            });

        // Update positions on simulation tick
        this.simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            nodeGroup
                .attr('transform', d => `translate(${d.x},${d.y})`);

            labels
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        // Store references for later use
        this.nodeSelection = nodeGroup;
        this.linkSelection = link;
        this.labelSelection = labels;
    }

    getNodeSize(d) {
        // Different sizes based on resource importance
        const sizes = {
            'Virtual Network': 18,
            'Load Balancer': 16,
            'Application Gateway': 16,
            'SQL Database': 15,
            'Cosmos DB': 15,
            'Key Vault': 14,
            'Virtual Machine': 14,
            'App Service': 13,
            'Function App': 12,
            'Storage Account': 13,
            'Blob Storage': 12
        };
        return sizes[d.type] || 12;
    }

    getLinkColor(d) {
        const colors = {
            'network': '#0078d4',
            'security': '#ffb900',
            'same-rg': '#40e0d0',
            'dependency': '#8a8886',
            'cross-rg': '#5c2d91'
        };
        return colors[d.type] || '#d0d7de';
    }

    getLinkWidth(d) {
        if (d.type === 'network') return 2;
        if (d.type === 'security') return 2;
        if (d.strength > 0.7) return 2;
        return 1;
    }

    getStatusColor(status) {
        const colors = {
            'Running': '#107c10',
            'Stopped': '#d13438',
            'Warning': '#ffb900'
        };
        return colors[status] || '#8a8886';
    }

    getNodeColor(d) {
        const colors = {
            'Virtual Machine': '#0078d4',
            'Storage Account': '#00bcf2',
            'Virtual Network': '#40e0d0',
            'Key Vault': '#ffb900',
            'App Service': '#00a4ef',
            'SQL Database': '#ff8c00',
            'Load Balancer': '#5c2d91',
            'Network Security Group': '#e81123',
            'Public IP': '#107c10',
            'Application Gateway': '#881798',
            'Container Registry': '#00188f',
            'Function App': '#0078d4'
        };
        return colors[d.type] || '#0078d4';
    }

    drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }

    showTooltip(event, d) {
        const statusIcon = d.status === 'Running' ? '●' : d.status === 'Stopped' ? '●' : '⚠';
        const statusColor = d.status === 'Running' ? '#107c10' : d.status === 'Stopped' ? '#d13438' : '#ffb900';
        
        const tagsHtml = Object.entries(d.tags)
            .map(([key, value]) => `<span style="background-color: rgba(0,120,212,0.1); padding: 2px 6px; border-radius: 3px; font-size: 11px; margin-right: 4px;">${key}: ${value}</span>`)
            .join('');

        const tooltipContent = `
            <div style="font-weight: 600; margin-bottom: 8px; display: flex; align-items: center;">
                <span style="font-size: 16px; margin-right: 6px;">${d.icon}</span>
                ${d.displayName}
            </div>
            <div style="margin-bottom: 4px;"><strong>Type:</strong> ${d.type}</div>
            <div style="margin-bottom: 4px;"><strong>Category:</strong> ${d.category}</div>
            <div style="margin-bottom: 4px;"><strong>Resource Group:</strong> ${d.resourceGroup}</div>
            <div style="margin-bottom: 4px;"><strong>Location:</strong> ${d.location}</div>
            <div style="margin-bottom: 4px;"><strong>Subscription:</strong> ${d.subscription}</div>
            <div style="margin-bottom: 8px; display: flex; align-items: center;">
                <strong>Status:</strong> 
                <span style="color: ${statusColor}; margin-left: 6px;">${statusIcon}</span>
                <span style="margin-left: 4px;">${d.status}</span>
            </div>
            ${tagsHtml ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);"><strong>Tags:</strong><br/>${tagsHtml}</div>` : ''}
        `;

        this.tooltip
            .html(tooltipContent)
            .style('opacity', 1)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY + 10) + 'px');
    }

    hideTooltip() {
        this.tooltip.style('opacity', 0);
    }

    highlightConnectedNodes(node, nodeSelection, linkSelection) {
        const connectedNodeIds = new Set();
        
        // Find connected nodes
        this.links.forEach(link => {
            if (link.source.id === node.id) {
                connectedNodeIds.add(link.target.id);
            } else if (link.target.id === node.id) {
                connectedNodeIds.add(link.source.id);
            }
        });

        // Fade non-connected nodes
        nodeSelection.style('opacity', d => 
            d.id === node.id || connectedNodeIds.has(d.id) ? 1 : 0.3
        );

        // Highlight connected links
        linkSelection.style('opacity', d => 
            d.source.id === node.id || d.target.id === node.id ? 1 : 0.1
        );
    }

    removeHighlights(nodeSelection, linkSelection) {
        nodeSelection.style('opacity', 1);
        linkSelection.style('opacity', 0.6);
    }

    setupEventListeners() {
        // Zoom controls
        document.querySelector('.control-btn[title="Zoom In"]').addEventListener('click', () => {
            this.svg.transition().call(
                d3.zoom().transform,
                d3.zoomTransform(this.svg.node()).scale(this.transform.k * 1.2)
            );
        });

        document.querySelector('.control-btn[title="Zoom Out"]').addEventListener('click', () => {
            this.svg.transition().call(
                d3.zoom().transform,
                d3.zoomTransform(this.svg.node()).scale(this.transform.k * 0.8)
            );
        });

        document.querySelector('.control-btn[title="Fit to Screen"]').addEventListener('click', () => {
            this.fitToScreen();
        });

        document.querySelector('.control-btn[title="Reset View"]').addEventListener('click', () => {
            this.resetView();
        });

        // Search functionality
        const searchInput = document.querySelector('.filter-input');
        searchInput.addEventListener('input', (e) => {
            this.searchNodes(e.target.value);
        });

        // Run button functionality
        document.querySelector('.btn-primary').addEventListener('click', () => {
            this.regenerateData();
        });
    }

    fitToScreen() {
        if (!this.nodes.length) return;

        const bounds = this.g.node().getBBox();
        const fullWidth = this.width;
        const fullHeight = this.height;
        const width = bounds.width;
        const height = bounds.height;
        const midX = bounds.x + width / 2;
        const midY = bounds.y + height / 2;

        if (width === 0 || height === 0) return;

        const scale = 0.9 / Math.max(width / fullWidth, height / fullHeight);
        const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

        this.svg.transition()
            .duration(750)
            .call(d3.zoom().transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    }

    resetView() {
        this.svg.transition()
            .duration(750)
            .call(d3.zoom().transform, d3.zoomIdentity);
    }

    searchNodes(searchTerm) {
        if (!searchTerm) {
            this.nodeSelection.style('opacity', 1);
            this.linkSelection.style('opacity', 0.6);
            this.labelSelection.style('opacity', 1);
            return;
        }

        const matchingNodes = this.nodes.filter(node => 
            node.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.resourceGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
            node.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            Object.values(node.tags).some(tag => 
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        const matchingNodeIds = new Set(matchingNodes.map(n => n.id));

        this.nodeSelection.style('opacity', d => 
            matchingNodeIds.has(d.id) ? 1 : 0.2
        );

        this.labelSelection.style('opacity', d => 
            matchingNodeIds.has(d.id) ? 1 : 0.2
        );

        this.linkSelection.style('opacity', d => 
            matchingNodeIds.has(d.source.id) || matchingNodeIds.has(d.target.id) ? 0.6 : 0.1
        );
    }

    regenerateData() {
        this.generateSampleData();
        this.createVisualization();
    }
}

// Initialize the visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AzureResourceGraphExplorer();
});

// Add some interactivity to other UI elements
document.addEventListener('DOMContentLoaded', () => {
    // Filter pill removal
    document.querySelectorAll('.pill-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.filter-pill').remove();
        });
    });

    // Tab switching (visual only)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Mock functionality for other buttons
    document.querySelectorAll('.btn-secondary, .header-btn, .control-btn').forEach(btn => {
        if (!btn.onclick && !btn.addEventListener) {
            btn.addEventListener('click', () => {
                console.log(`${btn.textContent || btn.title || 'Button'} clicked`);
            });
        }
    });
});