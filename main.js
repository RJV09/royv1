const { ClusterManager } = require('discord-hybrid-sharding');

class ryzenCluster extends ClusterManager {
    constructor(file, options = {}) {
        // Default shard configuration
        const defaultOptions = {
            totalShards: 'auto', // Can be set to specific number
            totalClusters: 'auto', // Can be set to specific number
            shardsPerClusters: 2,
            mode: 'process', // or 'worker'
            token: process.env.PRIMARY_TOKEN,
            ...options
        };
        
        super(file, defaultOptions);
        this.stats = new Map();
        this.globalStats = {
            cpu: 0,
            ram: 0,
            uptime: 0,
        };
    }
    async collectStats() {
        const promises = [];
        for (const [id, cluster] of this.clusters) {
            promises.push(
                cluster.request({ type: 'STATS_REQUEST' })
                    .then(stats => this.stats.set(id, stats))
                    .catch(err => console.error(`Failed to collect stats from cluster ${id}:`, err))
            );
        }
        await Promise.all(promises);
        this.updateGlobalStats();
    }
    updateGlobalStats() {
        let totalCPU = 0;
        let totalRAM = 0;
        let totalUptime = 0;
        for (const stats of this.stats.values()) {
            totalCPU += stats.cpu;
            totalRAM += stats.ram;
            totalUptime += stats.uptime;
        }
        this.globalStats = {
            cpu: totalCPU / this.clusters.size,
            ram: totalRAM,
            uptime: totalUptime / this.clusters.size,
        };
    }
}

module.exports = { ryzenCluster };