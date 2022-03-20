const FileModel = require('../db').files;
const MessageModel = require('../db').messages;
const UserModel = require('../db').users;

class FileService {

    async createMediaFiles(files, senderId, relationId, text) {

        if (files.length > 5) {
            const nestedFiles = this._getNestedFiles(files);
            let messageText = text;

            return await Promise.all(nestedFiles.map(async fileArray => {
                const {id} = await MessageModel.create(
                    {
                        text: messageText,
                        relationId,
                        userId: senderId
                    },
                );

                const rows = this._getFormattedFiles(fileArray, id);

                await FileModel.bulkCreate(rows);

                return await MessageModel.findOne(
                    {
                        where: {id},
                        include: [
                            {
                                model: FileModel,
                                as: 'files'
                            },
                            {
                                model: UserModel,
                                as: 'sender',
                            }
                        ]
                    });
            }));
        } else {
            const {id} = await MessageModel.create(
                {
                    text,
                    relationId,
                    userId: senderId,
                }
            );

            const rows = this._getFormattedFiles(files, id);

            await FileModel.bulkCreate(rows);

            const message = await MessageModel.findOne(
                {
                    where: {id},
                    include: [
                        {
                            model: FileModel,
                            as: 'files'
                        },
                        {
                            model: UserModel,
                            as: 'sender',
                        }
                    ]
                });

            return [message];
        }
    }

    _getNestedFiles(files) {
        let residual = files.length;
        let start = 0;
        const rows = [];

        while (residual >= 5) {
            rows.push(files.slice(start, start + 5));

            residual -= 5;
            start += 5;
        }

        if (residual >= 1) {
            rows.push(files.slice(start, start + residual))
        }

        return rows;
    }

    _getFormattedFiles(files, messageId) {
        return files.map(file => {
            return {
                originalName: file.originalname,
                uniqueName: file.filename,
                messageId
            }
        })
    }

}

module.exports = new FileService();
