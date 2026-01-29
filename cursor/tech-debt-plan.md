# AskDarcel Web Application - Technical Debt Plan

This document outlines technical debt items identified in the AskDarcel web application codebase. Items are prioritized by impact and urgency.

## Priority Legend

- 🔴 **Critical**: Security issues, breaking changes, blocking development
- 🟠 **High**: Significant impact on maintainability, performance, or developer experience
- 🟡 **Medium**: Moderate impact, should be addressed in next major refactor
- 🟢 **Low**: Nice-to-have improvements, can be deferred

---

## 🔴 Critical Priority

### 1. Upgrade React from 16.8.6 to React 18+

**Impact**: Security, performance, access to modern React features

**Current State**:
- Using React `^16.8.6` (released 2019)
- Missing React 18 features (concurrent rendering, automatic batching, etc.)
- No longer receiving security updates for React 16

**Files Affected**:
- [`package.json`](package.json) - Dependency versions
- [`app/init.tsx`](app/init.tsx) - Entry point using deprecated `ReactDOM.render()`

**Action Items**:
- [ ] Update `react` and `react-dom` to `^18.2.0`
- [ ] Replace `ReactDOM.render()` with `createRoot()` in [`app/init.tsx`](app/init.tsx)
- [ ] Update `@types/react` and `@types/react-dom` to match React 18
- [ ] Test all components for React 18 compatibility
- [ ] Update React Router to v6 (compatible with React 18)
- [ ] Review and update lifecycle methods in class components

**Estimated Effort**: 2-3 days

**References**:
- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React Router v6 Migration](https://reactrouter.com/en/main/upgrading/v5)

---

### 2. Replace Deprecated ReactDOM.render() with createRoot()

**Impact**: Breaking change in React 18, current code will not work

**Current Code** ([`app/init.tsx`](app/init.tsx:31)):
```typescript
ReactDOM.render(
  <BrowserRouter>
    <HelmetProvider>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </HelmetProvider>
  </BrowserRouter>,
  rootElement
);
```

**Required Change**:
```typescript
import { createRoot } from 'react-dom/client';

const root = createRoot(rootElement);
root.render(
  <BrowserRouter>
    <HelmetProvider>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </HelmetProvider>
  </BrowserRouter>
);
```

**Action Items**:
- [ ] Import `createRoot` from `react-dom/client`
- [ ] Replace `ReactDOM.render()` call
- [ ] Test application startup

**Estimated Effort**: 30 minutes

---

### 3. Fix API Limitations Documented in Code

**Impact**: Broken functionality, user-facing bugs

**Known Issues**:

#### 3a. Address ID Not Returned on Creation
**Location**: [`app/pages/OrganizationEditPage.tsx`](app/pages/OrganizationEditPage.tsx:1044-1093)

**Problem**: API doesn't return newly created address IDs, breaking service-address associations.

**Current Workaround**: HACK comment documents the limitation, code throws error:
```typescript
// HACK: WE CANNOT ACTUALLY IMPLEMENT SCENARIOS 3 AND 4 BECAUSE THE API DOES
// NOT RESPOND WITH THE NEWLY CREATED ADDRESSES' IDS.
```

**Action Items**:
- [ ] Coordinate with backend team to fix API response
- [ ] Update API to return created address IDs
- [ ] Remove HACK comments and implement proper logic
- [ ] Add error handling for edge cases

**Estimated Effort**: 1-2 days (depends on backend)

---

#### 3b. Bookmark API Doesn't Return Created Bookmark
**Location**: [`app/models/Bookmark.ts`](app/models/Bookmark.ts:43)

**Problem**: API doesn't return bookmark object on successful POST.

**Action Items**:
- [ ] Fix backend API to return created bookmark
- [ ] Update frontend to use returned bookmark data
- [ ] Remove workaround code

**Estimated Effort**: 1 day

---

### 4. Add Comprehensive Error Handling

**Impact**: Poor user experience, difficult debugging

**Current State**:
- Many API calls lack error handling (67+ TODO comments mention "Handle failure?")
- Generic error messages
- Errors often silently fail

**Files Needing Error Handling**:
- [`app/hooks/APIHooks.ts`](app/hooks/APIHooks.ts:8) - `useEligibilitiesForCategory`, `useSubcategoriesForCategory`
- [`app/pages/ServiceDiscoveryResults/ServiceDiscoveryResults.tsx`](app/pages/ServiceDiscoveryResults/ServiceDiscoveryResults.tsx:83)
- [`app/pages/ServiceListingPage.tsx`](app/pages/ServiceListingPage.tsx:46) - "TODO Handle Errors"
- [`app/pages/OrganizationListingPage.tsx`](app/pages/OrganizationListingPage.tsx:41) - "TODO Handle Errors"
- [`app/pages/EditBreakingNewsPage.tsx`](app/pages/EditBreakingNewsPage.tsx:129) - Missing catch block

**Action Items**:
- [ ] Create centralized error handling utility
- [ ] Add try-catch blocks to all API calls
- [ ] Implement user-friendly error messages
- [ ] Add error boundaries for React components
- [ ] Log errors to Sentry with context
- [ ] Add retry logic for transient failures

**Estimated Effort**: 3-5 days

---

## 🟠 High Priority

### 5. Convert Class Components to Functional Components

**Impact**: Code consistency, maintainability, React 18 compatibility

**Class Components Found**:
1. [`app/pages/OrganizationEditPage.tsx`](app/pages/OrganizationEditPage.tsx:856) - 1961 lines ⚠️
2. [`app/pages/debug/ListingDemoPage.tsx`](app/pages/debug/ListingDemoPage.tsx:188)
3. [`app/components/search/SearchEntry.tsx`](app/components/search/SearchEntry.tsx:18)
4. [`app/components/search/Refinements/FacetRefinementList.tsx`](app/components/search/Refinements/FacetRefinementList.tsx:27)
5. [`app/components/edit/MultiSelectDropdown.tsx`](app/components/edit/MultiSelectDropdown.tsx:54)
6. [`app/components/edit/EditScheduleDay.tsx`](app/components/edit/EditScheduleDay.tsx:113)
7. [`app/components/edit/EditSchedule.tsx`](app/components/edit/EditSchedule.tsx:16)
8. [`app/components/edit/EditPhones.tsx`](app/components/edit/EditPhones.tsx:16)
9. [`app/components/edit/EditNote.tsx`](app/components/edit/EditNote.tsx:15)
10. [`app/components/edit/EditCollection.tsx`](app/components/edit/EditCollection.tsx:59) - HOC returning class component

**Action Items**:
- [ ] Start with smaller components (EditNote, EditPhone)
- [ ] Convert OrganizationEditPage last (most complex)
- [ ] Replace `this.state` with `useState` hooks
- [ ] Replace lifecycle methods with `useEffect`
- [ ] Update tests to work with functional components
- [ ] Remove unused class component dependencies

**Estimated Effort**: 1-2 weeks (OrganizationEditPage alone will take 3-4 days)

---

### 6. Refactor OrganizationEditPage.tsx (1961 lines)

**Impact**: Maintainability, testability, developer experience

**Current Issues**:
- Single file with 1961 lines
- Complex state management
- Multiple responsibilities (CRUD for orgs, services, addresses, schedules)
- Difficult to test
- Hard to understand and modify

**Action Items**:
- [ ] Extract address management to separate component/hook
- [ ] Extract service management to separate component/hook
- [ ] Extract schedule management to separate component/hook
- [ ] Create custom hooks for API operations
- [ ] Split into multiple smaller components
- [ ] Add comprehensive tests for each extracted piece

**Estimated Effort**: 1 week

**Suggested Structure**:
```
OrganizationEditPage/
├── OrganizationEditPage.tsx (main component, ~200 lines)
├── hooks/
│   ├── useOrganizationData.ts
│   ├── useAddressManagement.ts
│   ├── useServiceManagement.ts
│   └── useScheduleManagement.ts
├── components/
│   ├── OrganizationForm.tsx
│   ├── AddressSection.tsx
│   ├── ServiceSection.tsx
│   └── ScheduleSection.tsx
└── utils/
    └── organizationTransformers.ts
```

---

### 7. Update Outdated Dependencies

**Impact**: Security vulnerabilities, missing features, compatibility issues

**Critical Updates Needed**:

#### 7a. React Select (Very Outdated)
- **Current**: `react-select@^1.0.0-rc.5` (RC version from 2017)
- **Target**: `react-select@^5.7.0`
- **Breaking Changes**: API changes, TypeScript types

#### 7b. Moment.js (Deprecated)
- **Current**: `moment@^2.24.0`
- **Target**: `date-fns@^2.30.0` or `dayjs@^1.11.7`
- **Reason**: Moment.js is in maintenance mode

#### 7c. Lodash (Large Bundle)
- **Current**: `lodash@^4.17.19`
- **Target**: Use individual lodash functions or native JS
- **Reason**: Reduce bundle size

#### 7d. React Router
- **Current**: `react-router-dom@^5.1.2`
- **Target**: `react-router-dom@^6.20.0`
- **Breaking Changes**: Route configuration, hooks API

**Action Items**:
- [ ] Audit all dependencies for security vulnerabilities (`npm audit`)
- [ ] Update non-breaking dependencies first
- [ ] Create migration plan for breaking changes
- [ ] Update React Select (test thoroughly)
- [ ] Replace Moment.js with date-fns or dayjs
- [ ] Replace lodash with native JS or individual imports
- [ ] Migrate React Router to v6

**Estimated Effort**: 1-2 weeks

---

### 8. Enable TypeScript Strict Mode

**Impact**: Type safety, catch bugs at compile time

**Current State**:
- TypeScript strict mode is enabled in [`tsconfig.json`](tsconfig.json:9)
- But many type safety rules are disabled in ESLint:
  - `@typescript-eslint/no-unsafe-assignment`: off
  - `@typescript-eslint/no-unsafe-call`: off
  - `@typescript-eslint/no-unsafe-member-access`: off
  - `@typescript-eslint/no-unsafe-return`: off

**Action Items**:
- [ ] Enable strict TypeScript rules in ESLint
- [ ] Fix all type errors incrementally
- [ ] Add proper types for `any` usage
- [ ] Remove `@ts-ignore` and `@ts-expect-error` comments
- [ ] Add type definitions for untyped modules

**Estimated Effort**: 1-2 weeks

---

### 9. Address 67+ TODO/FIXME/HACK Comments

**Impact**: Code quality, technical debt accumulation

**Breakdown**:
- **TODO**: 50+ items
- **FIXME**: 2 items
- **HACK**: 8+ items

**High-Priority TODOs**:

1. **API Error Handling** (Multiple files)
   - [`app/hooks/APIHooks.ts`](app/hooks/APIHooks.ts:8)
   - [`app/pages/ServiceDiscoveryResults/ServiceDiscoveryResults.tsx`](app/pages/ServiceDiscoveryResults/ServiceDiscoveryResults.tsx:83)

2. **Data Structure Improvements**
   - [`app/pages/OrganizationEditPage.tsx`](app/pages/OrganizationEditPage.tsx:73) - "Stop using objects with number keys, use Map type"

3. **User Experience**
   - [`app/pages/OrganizationEditPage.tsx`](app/pages/OrganizationEditPage.tsx:1720) - "Do not use alert() for user notifications"
   - [`app/components/listing/TableOfContactInfo.tsx`](app/components/listing/TableOfContactInfo.tsx:13) - "Style this better with generic warning icon"

4. **Feature Completeness**
   - [`app/components/listing/TableOfOpeningTimes.tsx`](app/components/listing/TableOfOpeningTimes.tsx:4-7) - Multiple TODOs for schedule display
   - [`app/components/listing/OrganizationCard.tsx`](app/components/listing/OrganizationCard.tsx:25) - "Walking distance"
   - [`app/components/listing/OrganizationCard.tsx`](app/components/listing/OrganizationCard.tsx:27) - "Add Rating"

**Action Items**:
- [ ] Create GitHub issues for each TODO
- [ ] Prioritize by impact
- [ ] Address critical TODOs first
- [ ] Remove resolved TODOs
- [ ] Document decisions for deferred items

**Estimated Effort**: Ongoing, prioritize critical items

---

### 10. Remove Deprecated Tiller Dependency

**Impact**: Security, maintainability

**Current State**:
- [`Dockerfile`](Dockerfile:2) - Comment: "tiller is not compatible with Ruby 3.2.0"
- Using Ruby-based Tiller for configuration management
- Tiller appears to be deprecated/unmaintained

**Action Items**:
- [ ] Research Tiller alternatives (envsubst, yq, etc.)
- [ ] Migrate configuration management
- [ ] Update Dockerfile
- [ ] Test deployment process

**Estimated Effort**: 2-3 days

---

## 🟡 Medium Priority

### 11. Improve Test Coverage

**Impact**: Code quality, regression prevention

**Current State**:
- Limited unit tests (only a few components have tests)
- E2E tests exist but coverage is unknown
- Many critical paths lack tests

**Action Items**:
- [ ] Add unit tests for utility functions
- [ ] Add component tests for critical components
- [ ] Add integration tests for API calls
- [ ] Improve E2E test coverage
- [ ] Set up code coverage reporting
- [ ] Add tests for OrganizationEditPage (currently untested)

**Estimated Effort**: 2-3 weeks

---

### 12. Standardize CSS Architecture

**Impact**: Maintainability, consistency

**Current State**:
- Mix of CSS Modules and global styles
- Some components use inline styles
- CSS specificity hacks (repeated class names)
- Inconsistent naming conventions

**Issues Found**:
- [`app/components/edit/EditAddress.module.scss`](app/components/edit/EditAddress.module.scss:89,152) - Repeated class names for specificity hacks

**Action Items**:
- [ ] Audit all CSS files
- [ ] Standardize on CSS Modules for component styles
- [ ] Remove specificity hacks
- [ ] Create design tokens/variables file
- [ ] Document CSS architecture guidelines
- [ ] Refactor inconsistent styles

**Estimated Effort**: 1 week

---

### 13. Modernize Webpack Configuration

**Impact**: Build performance, developer experience

**Current State**:
- Webpack 5 configuration
- Some deprecated plugins/options
- Could benefit from optimizations

**Action Items**:
- [ ] Review webpack config for deprecated options
- [ ] Add code splitting by route
- [ ] Optimize bundle size
- [ ] Improve build performance
- [ ] Add bundle analyzer
- [ ] Consider migrating to Vite (long-term)

**Estimated Effort**: 3-5 days

---

### 14. Remove Google Analytics Universal Analytics (UA)

**Impact**: Code cleanup, compliance

**Current State**:
- Using both UA and GA4
- UA sunsetted in July 2023
- Code comments indicate removal planned

**Files**:
- [`app/App.tsx`](app/App.tsx:3-6) - Comment about removing react-ga
- [`app/pages/ServiceDiscoveryForm/ServiceDiscoveryForm.tsx`](app/pages/ServiceDiscoveryForm/ServiceDiscoveryForm.tsx:6)
- [`app/pages/UcsfDiscoveryForm/UcsfDiscoveryForm.tsx`](app/pages/UcsfDiscoveryForm/UcsfDiscoveryForm.tsx:5)

**Action Items**:
- [ ] Remove `react-ga` package
- [ ] Remove all UA tracking code
- [ ] Keep only GA4 implementation
- [ ] Update documentation

**Estimated Effort**: 1 day

---

### 15. Improve Code Organization

**Impact**: Developer experience, onboarding

**Action Items**:
- [ ] Create component documentation
- [ ] Add JSDoc comments to public APIs
- [ ] Organize utilities by domain
- [ ] Create shared types/interfaces file
- [ ] Document architectural decisions (ADR format)

**Estimated Effort**: 1 week

---

## 🟢 Low Priority

### 16. Implement Code Splitting and Lazy Loading

**Impact**: Performance, initial load time

**Current State**:
- Single bundle for entire application
- All routes loaded upfront
- Large initial bundle size

**Action Items**:
- [ ] Implement route-based code splitting
- [ ] Lazy load heavy components (maps, PDF viewers)
- [ ] Split vendor bundles
- [ ] Add loading states for lazy components

**Estimated Effort**: 3-5 days

---

### 17. Accessibility Audit and Improvements

**Impact**: Compliance, user experience

**Action Items**:
- [ ] Run accessibility audit (axe, Lighthouse)
- [ ] Fix critical a11y issues
- [ ] Add ARIA labels where missing
- [ ] Improve keyboard navigation
- [ ] Test with screen readers
- [ ] Document a11y guidelines

**Estimated Effort**: 1-2 weeks

---

### 18. Performance Optimizations

**Impact**: User experience, Core Web Vitals

**Action Items**:
- [ ] Analyze bundle size
- [ ] Optimize images (WebP, lazy loading)
- [ ] Implement virtual scrolling for long lists
- [ ] Optimize re-renders (React.memo, useMemo)
- [ ] Add performance monitoring

**Estimated Effort**: 1 week

---

### 19. Migrate Remaining JavaScript to TypeScript

**Impact**: Type safety, developer experience

**Current State**:
- Mix of `.js`, `.jsx`, `.ts`, `.tsx` files
- Gradual migration in progress

**Action Items**:
- [ ] Identify remaining JS files
- [ ] Convert to TypeScript incrementally
- [ ] Add type definitions
- [ ] Update imports

**Estimated Effort**: 1-2 weeks

---

### 20. Update Documentation

**Impact**: Developer onboarding, maintenance

**Action Items**:
- [ ] Update README with current setup instructions
- [ ] Document API integration patterns
- [ ] Create component library documentation
- [ ] Add architecture decision records (ADRs)
- [ ] Update contributing guidelines

**Estimated Effort**: 1 week

---

## Summary

### Quick Wins (Can be done immediately):
1. Remove deprecated `ReactDOM.render()` (30 min)
2. Remove Universal Analytics code (1 day)
3. Fix simple TODO items (ongoing)

### High Impact (Should prioritize):
1. React 18 upgrade (2-3 days)
2. Error handling improvements (3-5 days)
3. Class component migration (1-2 weeks)
4. Dependency updates (1-2 weeks)

### Long-term Refactoring:
1. OrganizationEditPage refactor (1 week)
2. TypeScript strict mode (1-2 weeks)
3. Test coverage improvements (2-3 weeks)

### Estimated Total Effort:
- **Critical**: ~1-2 weeks
- **High Priority**: ~4-6 weeks
- **Medium Priority**: ~3-4 weeks
- **Low Priority**: ~4-5 weeks

**Total**: ~12-17 weeks of focused development

---

## Tracking Progress

Consider creating GitHub issues/projects to track these items:
- Create labels: `tech-debt`, `critical`, `high-priority`, etc.
- Link issues to this document
- Update this document as items are completed
- Review quarterly to reassess priorities
