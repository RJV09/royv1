
const { ryzenCluster } = require('./main.js');

// Initialize cluster manager with custom shard settings
const manager = new ryzenCluster('./ryzen.js', {
    totalShards: 'auto', // Auto-calculate or set specific number
    totalClusters: 2, // Number of clusters
    shardsPerClusters: 2, // Shards per cluster
    mode: 'process', // or 'worker'
    token: process.env.PRIMARY_TOKEN
});

// Event handlers for cluster management
manager.on('clusterCreate', cluster => {
    console.log(`Cluster ${cluster.id} created`);
});

manager.on('clusterReady', cluster => {
    console.log(`Cluster ${cluster.id} is ready`);
});

manager.on('clusterReconnect', cluster => {
    console.log(`Cluster ${cluster.id} reconnected`);
});

// Spawn clusters
manager.spawn({ timeout: -1 });

console.log('Starting bot in sharded mode...');
