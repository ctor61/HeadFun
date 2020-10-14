///<reference path="p5.d.ts" />


    declare function loadSound(
        path: string | any[],
        successCallback?: (...args: any[]) => any,
        errorCallback?: (...args: any[]) => any,
        whileLoading?: (...args: any[]) => any
    ): p5.SoundFile;