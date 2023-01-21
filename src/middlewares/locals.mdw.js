import categoryList from "../models/category.model.js"

export default function (app) {
    app.use(async function (req, res, next) {
        if (typeof req.session.authUser === 'undefined') {
            req.session.auth = false;
            req.session.authUser = null;
        }
        res.locals.auth = req.session.auth

        console.log("auth: ", req.session.auth);
        console.log("auth: ", req.session.authUser);
        res.locals.authUser = req.session.authUser;

        const listCategory1 = await categoryList.findCategoryLv1();
        const listCategory2 = await categoryList.findCategoryLv2();
        // console.log("list category lv1: ", listCategory1);
        // console.log("list category lv2: ", listCategory2);
        // console.log("length category lv2: ", listCategory2.length);

        // for (let post = 0; post < listCategory2.length; post++) {
        //     // console.log("category lv2: ", listCategory2[post].id_category_lv1);
        // }


        for (let i = 0; i < listCategory1.length; i++) {
            var arrayTemp = [];

            for (let post = 0; post < listCategory2.length; post++) {
                // console.log("category lv2: ", listCategory2[post].id_category_lv1);
                if (listCategory2[post].id_category_lv1 === listCategory1[i].id_category_lv1) {
                    // console.log(listCategory2[post]);
                    arrayTemp.push(listCategory2[post]);
                }
            }
            listCategory1[i]["listArray2"] = arrayTemp;
        }

        res.locals.listCategory = listCategory1;
        // console.log(listCategory1);


        next();
    });
}
