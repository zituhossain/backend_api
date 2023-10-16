const combineDetailsReportQueue = require('./updatePlaceQueue'); // Use the combineDetailsReportQueue
const { Place } = require('./models'); // Import your Place model

// Define the start function for the worker
function start() {
    combineDetailsReportQueue.process(async (job) => {
        try {
            const { placeId, updatedData } = job.data;

            // Update the Place table with the updated JSON object
            await Place.update(
                { updated_json: updatedData },
                { where: { id: placeId } }
            );
            console.log('Data processed for place ID:', placeId);
        } catch (error) {
            console.error('Error processing job:', error);
        }
    });
}

module.exports = { start };