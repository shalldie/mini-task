import parallelLimit from './parallelLimit';

/**
 * parallel 模块
 * 
 * @export
 * @param {any} tasks
 * @param {any} callback
 * @returns
 */
export default function (tasks, callback) {
    return parallelLimit(tasks, 0, callback);
}