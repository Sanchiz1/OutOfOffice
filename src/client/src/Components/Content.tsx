import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { requestAccount } from '../API/employeeRequests';
import { isSigned } from '../API/loginRequests';
import { ShowFailure } from '../Helpers/SnackBarHelper';
import { setGlobalError, setLogInError, setPermissionError } from '../Redux/Reducers/AccountReducer';
import { RootState } from '../Redux/store';
import EmployeesPage from './Employees/EmployeesPage';
import CreateLeaveRequest from './LeaveRequest/CreateLeaveRequest';
import LeaveRequestPage from './LeaveRequest/LeaveRequestPage';
import Main from './Main';
import Header from './Navbar';
import SignIn from './Sign/Sign-in';
import UserPage from './User/UserPage';
import NotFoundPage from './UtilComponents/NotFoundPage';
import ProjectsPage from './Projects/ProjectsPage';
import CreateProject from './Projects/CreateProjectPage';
import ProjectPage from './Projects/ProjectPage';
import AddToProjectPage from './Projects/AddToProjectPage';
import ApprovalRequestsPage from './ApprovalRequests/ApprovalRequestsPage';
import ApprovalRequestPage from './ApprovalRequests/ApprovalRequestPage';

const router = (SignInErrorAction: () => void, PermissionErrorAction: () => void) => createBrowserRouter([
    {
        element: <Header />,
        children: [
            {
                path: "/",
                element: <Main />
            },
            {
                path: "/employee/:EmployeeId",
                element: <UserPage />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/employees",
                element: <EmployeesPage />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/createProject",
                element: <CreateProject />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/projects",
                element: <ProjectsPage />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/project/:ProjectId",
                element: <ProjectPage />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/project/:ProjectId/Add",
                element: <AddToProjectPage />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/createLeaveRequest",
                element: <CreateLeaveRequest />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/leaveRequest/:LeaveRequestId",
                element: <LeaveRequestPage />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/approvalRequests",
                element: <ApprovalRequestsPage />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/approvalRequest/:ApprovalRequestId",
                element: <ApprovalRequestPage />,
                loader: async () => CheckSigned(SignInErrorAction)
            },
            {
                path: "/Sign-in",
                element: <SignIn />,
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
        if (!roles.includes(result!.position)) {
            PermissionErrorAction();
            return redirect("/");
        };
    } catch (error) {
        PermissionErrorAction();
    }
    return null;
}
