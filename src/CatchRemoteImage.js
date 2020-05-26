// CatchRemoteImage.js
import axios from 'axios';

export default function (editor, imageElement) {
    const imageUrl = imageElement.getAttribute('src');
    const localDomains = ['dev.shanghecapital.com, shanghecapital.com'];

    const model = editor.model;

    // 检测是否需要上传
    function test(url) {
        if (url.indexOf(location.host) !== -1 || /(^\.)|(^\/)/.test(url)) {
            return true;
        }

        if (localDomains) {
            for (let domain in localDomains) {
                if (localDomains.hasOwnProperty(domain) && url.indexOf(localDomains[domain]) !== -1) {
                    return true;
                }
            }
        }

        return false;
    }

    // 图片上传
    function upload(url) {
        let data = new FormData();
        data.append('url', url);

        return axios.post(
            '/web/v1/api/upload-by-url',
            data,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
    }

    if (/^https?:/i.test(imageUrl) && !test(imageUrl)) {
        model.enqueueChange('transparent', writer => {
            writer.setAttribute('uploadStatus', 'uploading', imageElement);
        });

        upload(imageUrl)
            .then(response => {
                model.enqueueChange('transparent', writer => {
                    writer.setAttribute('src', response.data.url, imageElement);
                    writer.setAttribute('uploadStatus', 'complete', imageElement);
                });

                clean();
            })
            .catch(error => {
                model.enqueueChange('transparent', writer => {
                    writer.setAttribute('src', failImage, imageElement);
                    // Upload Failed
					console.log('ckeditor upload by url fail');
                });

                clean();
            })
    }

    function clean() {
        model.enqueueChange('transparent', writer => {
            writer.removeAttribute('uploadId', imageElement);
            writer.removeAttribute('uploadStatus', imageElement);
        });
    }
}
