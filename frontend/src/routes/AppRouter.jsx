import { Route, Routes } from 'react-router-dom'
import { AdminDashboard, AdminPosts, AdminUserDetail, AdminUsers } from '../features/admin'
import { AuthCallback } from '../features/auth'
import { Dashboard } from '../features/dashboard'
import { Feed } from '../features/feed'
import {
  CreatePost,
  EditPost,
  MyPosts,
  PostDetail,
  PublicPosts,
  SharedPost,
} from '../features/posts'
import { Home } from '../pages/public/Home'
import { Login } from '../pages/public/Login'
import { Register } from '../pages/public/Register'
import { ROUTES } from '../utils/constants'
import { RequireAdmin } from './RequireAdmin'
import { RequireAuth } from './RequireAuth'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallback />} />
      <Route path={ROUTES.PUBLIC_POSTS} element={<PublicPosts />} />
      <Route path={ROUTES.POST_DETAIL} element={<PostDetail />} />
      <Route path={ROUTES.SHARE_POST} element={<SharedPost />} />
      <Route
        path={ROUTES.FEED}
        element={
          <RequireAuth>
            <Feed />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.ADMIN_DASHBOARD}
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
      <Route
        path={ROUTES.ADMIN_POSTS}
        element={
          <RequireAdmin>
            <AdminPosts />
          </RequireAdmin>
        }
      />
      <Route
        path={ROUTES.ADMIN_USERS}
        element={
          <RequireAdmin>
            <AdminUsers />
          </RequireAdmin>
        }
      />
      <Route
        path={ROUTES.ADMIN_USER_DETAIL}
        element={
          <RequireAdmin>
            <AdminUserDetail />
          </RequireAdmin>
        }
      />
      <Route
        path={ROUTES.CREATE_POST}
        element={
          <RequireAuth>
            <CreatePost />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.MY_POSTS}
        element={
          <RequireAuth>
            <MyPosts />
          </RequireAuth>
        }
      />
      <Route
        path={ROUTES.EDIT_POST}
        element={
          <RequireAuth>
            <EditPost />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
