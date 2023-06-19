const moment = require('moment');
const jobRepo = require("job/repositories/job.repository");

const notification = require('../../helper/socketIoNotification');

class CronjobController {
    constructor() {
        this.users = [];
    }

    async sendNewJobNotification() {
        try {

            let new_jobs = await jobRepo.getAllByCategoryServicer();
            // console.log(new_jobs);

            if (new_jobs.length > 0) {
                new_jobs.forEach(async ele => {

                    ele.servicer_id.forEach(id => {
                        let payload = {
                            id: id,
                            payload: { type: 'job', subtype: 'added', message: "New job added." },
                            data: {
                                from_user_id: ele.user_id,
                                to_user_id: id,
                                notification_message: "New job added for " + ele.category + " ( " + ele.title + " ) ",
                                notification_against: { data: "job_id", value: ele.job_id },
                                type: "job",
                                sub_type: 'newJob'
                            }
                        }
                        notification.SendCronNotification(payload);

                    })
                    await jobRepo.updateById({ notified: true }, ele.job_id);
                });

            }

            // console.log("new_jobs CRON", new_jobs);

            return true;
        }
        catch (e) {
            console.log(e.message);
            return false
        }
    };

}

module.exports = new CronjobController();