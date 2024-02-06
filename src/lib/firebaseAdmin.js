'use server'

import admin, { ServiceAccount } from 'firebase-admin'
import { getApps, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase/auth';
import { createPublishDoc } from './contentfulCMA';
import { toField } from './contentfulClientUtils';

const adminConfig = {
    "projectId": "apo-x-dfbd3",
    "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDW3xij64KJXnzf\ne+/0+pZtmgxeyefI48FBJTxvARgGF/4938J4ULv0vX01FU/17KJUFXMtMHDumQPX\nFi4XoM+Dy00ghi7A+Jmsg2tMCmNEKNR+j6tj5zJ2ysUGy+8qrbW5zTjCOYzGsM4Q\n1ojDtCyOaUUI73zl6IM5CZ2CnDCez2ILx7XKdIaGOJXE/yrh3/ZwC0JyMZDGN/97\nH+lZPELkvjb7UJ4IGL4q3jNMehHYQl/tI/DwL3Xd8wKTJ5814FUYGwvm/a9ZOr8P\nuOSvKiJ7bl9E959ibJJ20z7SvTJdDYmxpwAr491cix8Zm+wHfneJL5ZzQ2G0FfAf\nkgXEG5+3AgMBAAECggEABHKMs4Ph6U773bJWhqcTKwSXwfSC6C0SqHMJW7DVmvav\nK/+wKkZdhZTQfSNKSuhRedUR07sfc0jWhAKxBIsvEGbKW2R7nkHnCGOV+nZylIwV\nzeLSZNh5umy7BEd/VU5QJx7g0GBZkhlBwqZ2ITre+zmhlKxEVQvpf2o8COKLvRW7\nDt64n09i8y1SUpr27Y58O/nQZ9JYP7LexLX+Tf2jfj7iw0VaMIxJ388DwYdig/HR\n+s8iOhOkrTlWBPMOlI2x+qLACWrJObDmH9HonIENVfbvUnzW+MIOXrdRN2Qrct64\nVozk0KcCr/CLRVOs7OA80Dlu2GauqWoh3tsCuO0tOQKBgQD/POOI3C0uvwqjA2K2\nBO6YSTsH9Zh2YljHTKooImLG3NeRgzhICuUZ5rdD6b1PhxIMrczH6VQd3uyGqBIy\n/Ezyem01YESKayX6DQAw+unDslQllhuDk/yQSCO5bvYhbBtq8ZtPxWXKJX22lNwZ\niWBXOH5GYE14xoHL92uOpVvivwKBgQDXg1mn4GfxSmI5Wgsik6QgQis24BnkUDj2\nZZyIsgAs4l5LOx3Q9agxCKGvlvyJ09CQRjUW3q8KdPk6SKzFeBWw32eyElDZWgGO\nDTB1WSmo2vrX8LFe+P0lzJwYdVmjYZSR0aW19XtGRgMVUSTt2PTCt3/CqLSZvcba\ndq48QEQZCQKBgEtMJTwM6G9wAK1SpF5aWiEnCXkxpQbXwKUbIt+wNT/Biv7snT/z\npt7bR5mLbUP27wY6h706QoyFZXXcQ3IzKGgoYetrOQ00ywFXsITCoRAQne5wuDE7\nCTlvbsqXx5jYkcYc/Nqtu3fFU673f28xLfDNQ8NzSaeluEj59wsgEVl1AoGBAKdd\nMzAjHrWM7ZDac5FLlQcUO9km2hSrlEENki26BlbVCSNlandPf2ls6ZuiJsamfu68\nBxiWoNr/ElmH/NxxsG6mYDIy9SSGOHTnmz1Wm/qs7GbsXeKCfJ1xM7vuzkkKS8We\nSRFw7WYakuRoGsS3WwUoWgiC2ZYXgilAR3k08215AoGBAMEmrfeNTMckIqE/pa+P\nBmB2R1Rc0erIlV1qKDrVa916R1NPRgN+O/CIqddoCORmOCUQCs5Z0vjfCC4EPmV+\ncmUKJDRKVg/5xq2QZTiIB0GDztxTRZuzavJEX7dY5Z4QsFBVQXylaRXU4sD9rmC+\nnxXNac0EH8SlWA/yYbrUrNVG\n-----END PRIVATE KEY-----\n",
    "clientEmail": "firebase-adminsdk-p9hpn@apo-x-dfbd3.iam.gserviceaccount.com"
}

let app;

try {
    app = getApp('admin');
} 
catch {
    app = admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
    }, 'admin');
}

const auth = app.auth();

export async function verifyToken(token) {
    return auth.verifyIdToken(token);
}