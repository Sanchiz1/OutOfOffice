import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { isSigned } from '../API/loginRequests';
import { requestAccount } from '../API/userRequests';
import { ShowFailure } from '../Helpers/SnackBarHelper';
import { setGlobalError, setLogInError, setPermissionError } from '../Redux/Reducers/AccountReducer';
import { RootState } from '../Redux/store';
import Main from './Main';
import Header from './Navbar';
import SignIn from './Sign/Sign-in';
import SignUp from './Sign/Sign-up';
import Settings from './User/Settings';
import UserPage from './User/UserPage';
import NotFoundPage from './UtilComponents/NotFoundPage';

const router = (SignInErrorAction: () => void, PermissionErrorAction: () => void) => createBrowserRouter([
    {
        element: <Header />,
        children: [
            {
                path: "/",
                element: <Main />
            },
            {
                path: "/user/:Username",
                element: <UserPage />
            },
            {
                path: "/settings",
                element: <Settings />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/Sign-in",
                element: <SignIn />,
            },
            {
                path: "/Sign-up",
                element: <SignUp />,
            },
            {
                path:"*",
                element: <NotFoundPage input='Page not found'></NotFoundPage>
            }
        ]
    }
])


export default function AppContent() {
    const dispatch = useDispatch();
    const globalError = useSelector((state: RootState) => state.account.GlobalError);

    const setErrorSignIn = () => {
        dispatch(setLogInError('Not signed in'));
    }

    useEffect(() => {
        if(globalError !== '') {
            ShowFailure(globalError);
            dispatch(setGlobalError(''));
        }
    }, [globalError])


    const setErrorPermission = () => {
        dispatch(setPermissionError('Don`t have permissions for this page'));
    }

    return (
        <>
            <RouterProvider router={router(setErrorSignIn, setErrorPermission)} />
        </>
    );
}



function CheckSigned(Action: () => void) {
    if (!isSigned()) {
        Action();
        return redirect("/")
    };
    return null;
}

async function CheckRole(SignInErrorAction: () => void, PermissionErrorAction: () => void, roles: string[]) {
    if (!isSigned()) {
        SignInErrorAction();
        return redirect("/")
    };
    try {
        const result = await requestAccount().toPromise();
        if (!roles.includes(result!.Role)) {
            PermissionErrorAction();
            return redirect("/");
        };
    } catch (error) {
        PermissionErrorAction();
    }
    return null;
}
