import { NotebookData } from '@/types/notebook';

export const initialNotebookData: NotebookData = {
  config: {
    title: 'ICPC Notebook',
    teamName: 'Sample Team Name',
    university: 'Sample University Name',
    date: 'December 14, 2018',
    initials: 'ST',
    columns: 3,
    orientation: 'landscape',
    fontSize: '10pt',
    columnSep: '0.1in',
    columnRule: true,
    lineNumbers: false,
    tabSize: 2,
  },
  sections: [
    {
      id: 'sec-1',
      title: '1 Algorithms',
      snippets: [
        {
          id: 'snip-1-1',
          title: "Mo's algorithm on trees",
          filename: 'mo_on_trees.cpp',
          language: 'cpp',
          content: `// Mo's algorithm on trees using Euler tour
#include <bits/stdc++.h>
using namespace std;

const int MAXN = 100005, BLOCK = 350;
int st[MAXN], en[MAXN], flat[2 * MAXN], timer = 0;
int up[MAXN][20], depth[MAXN];
vector<int> adj[MAXN];

void dfs(int u, int p) {
    st[u] = ++timer; flat[timer] = u;
    up[u][0] = p; depth[u] = depth[p] + 1;
    for (int i = 1; i < 20; ++i) up[u][i] = up[up[u][i-1]][i-1];
    for (int v : adj[u]) if (v != p) dfs(v, u);
    en[u] = ++timer; flat[timer] = u;
}

int lca(int u, int v) {
    if (depth[u] < depth[v]) swap(u, v);
    for (int i = 19; i >= 0; --i)
        if (depth[u] - (1 << i) >= depth[v]) u = up[u][i];
    if (u == v) return u;
    for (int i = 19; i >= 0; --i)
        if (up[u][i] != up[v][i]) { u = up[u][i]; v = up[v][i]; }
    return up[u][0];
}`
        },
        {
          id: 'snip-1-2',
          title: "Mo's algorithm",
          filename: 'mo_algorithm.cpp',
          language: 'cpp',
          content: `struct Query {
    int l, r, id;
    bool operator<(const Query& o) const {
        int b1 = l / BLOCK, b2 = o.l / BLOCK;
        if (b1 != b2) return b1 < b2;
        return (b1 & 1) ? r < o.r : r > o.r;
    }
};`
        },
        {
          id: 'snip-1-3',
          title: 'sliding window',
          filename: 'sliding_window.cpp',
          language: 'cpp',
          content: `// Monotonic deque for min in sliding window of size k
vector<int> minSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> res;
    for (int i = 0; i < (int)nums.size(); ++i) {
        if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] >= nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k - 1) res.push_back(nums[dq.front()]);
    }
    return res;
}`
        }
      ]
    },
    {
      id: 'sec-2',
      title: '2 DP Optimizations',
      snippets: [
        {
          id: 'snip-2-1',
          title: 'convex hull trick',
          filename: 'convex_hull_trick.cpp',
          language: 'cpp',
          content: `// LineContainer for CHT max queries (monotonic or arbitrary)
struct Line {
    mutable long long m, c, p;
    bool operator<(const Line& o) const { return m < o.m; }
    bool operator<(long long x) const { return p < x; }
};

struct LineContainer : multiset<Line, less<>> {
    static const long long inf = LLONG_MAX;
    long long div(long long a, long long b) { return a / b - ((a ^ b) < 0 && a % b); }
    bool isect(iterator x, iterator y) {
        if (y == end()) return x->p = inf, 0;
        if (x->m == y->m) x->p = x->c > y->c ? inf : -inf;
        else x->p = div(y->c - x->c, x->m - y->m);
        return x->p >= y->p;
    }
    void add(long long m, long long c) {
        auto z = insert({m, c, 0}), y = z++, x = y;
        while (isect(y, z)) z = erase(z);
        if (x != begin() && isect(--x, y)) isect(x, y = erase(y));
        while ((y = x) != begin() && (--x)->p >= y->p) isect(x, erase(y));
    }
    long long query(long long x) {
        assert(!empty());
        auto l = *lower_bound(x);
        return l.m * x + l.c;
    }
};`
        },
        {
          id: 'snip-2-2',
          title: 'divide and conquer',
          filename: 'dnc_dp.cpp',
          language: 'cpp',
          content: `// D&C Optimization: opt(i, j) <= opt(i, j+1)
void compute(int g, int l, int r, int optl, int optr) {
    if (l > r) return;
    int mid = (l + r) / 2;
    pair<long long, int> best = {1e18, -1};
    for (int k = optl; k <= min(mid, optr); ++k) {
        best = min(best, {dp_prev[k] + cost(k + 1, mid), k});
    }
    dp_cur[mid] = best.first;
    int opt = best.second;
    compute(g, l, mid - 1, optl, opt);
    compute(g, mid + 1, r, opt, optr);
}`
        }
      ]
    },
    {
      id: 'sec-3',
      title: '3 Data structures',
      snippets: [
        {
          id: 'snip-3-1',
          title: 'STL Treap',
          filename: 'stl_treap.cpp',
          language: 'cpp',
          content: `#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace __gnu_pbds;

template <typename T>
using ordered_set = tree<T, null_type, less<T>, rb_tree_tag, tree_order_statistics_node_update>;

// .find_by_order(k) -> iterator to kth element (0-indexed)
// .order_of_key(val) -> count of elements strictly smaller than val`
        },
        {
          id: 'snip-3-4',
          title: 'binary index tree',
          filename: 'fenwick.cpp',
          language: 'cpp',
          content: `struct Fenwick {
    int n; vector<long long> tree;
    Fenwick(int n) : n(n), tree(n + 1, 0) {}
    void add(int i, long long delta) {
        for (; i <= n; i += i & -i) tree[i] += delta;
    }
    long long query(int i) {
        long long sum = 0;
        for (; i > 0; i -= i & -i) sum += tree[i];
        return sum;
    }
};`
        },
        {
          id: 'snip-3-5',
          title: 'dsu',
          filename: 'dsu.cpp',
          language: 'cpp',
          content: `struct DSU {
    vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int i) {
        if (parent[i] == i) return i;
        return parent[i] = find(parent[i]);
    }
    bool unite(int i, int j) {
        int root_i = find(i), root_j = find(j);
        if (root_i != root_j) {
            if (rank[root_i] < rank[root_j]) swap(root_i, root_j);
            parent[root_j] = root_i;
            if (rank[root_i] == rank[root_j]) rank[root_i]++;
            return true;
        }
        return false;
    }
};`
        }
      ]
    },
    {
      id: 'sec-4',
      title: '4 Geometry',
      snippets: [
        {
          id: 'snip-4-1',
          title: 'center 2 points + radious',
          filename: 'circle_2p_r.cpp',
          language: 'cpp',
          content: `// Center of circle passing through p1 and p2 with radius r
using Point = complex<double>;
pair<Point, Point> circle2PointsRadius(Point p1, Point p2, double r) {
    Point d = p2 - p1;
    double dist = abs(d);
    if (dist > 2 * r || dist < 1e-9) return {Point(0, 0), Point(0, 0)};
    Point mid = (p1 + p2) / 2.0;
    double h = sqrt(max(0.0, r * r - dist * dist / 4.0));
    Point normal = Point(-d.imag(), d.real()) / dist * h;
    return {mid + normal, mid - normal};
}`
        }
      ]
    },
    {
      id: 'sec-5',
      title: '5 Graphs',
      snippets: [
        {
          id: 'snip-5-1',
          title: 'SCC kosaraju',
          filename: 'scc_kosaraju.cpp',
          language: 'cpp',
          content: `vector<vector<int>> adj, adj_rev;
vector<bool> used;
vector<int> order, component;

void dfs1(int v) {
    used[v] = true;
    for (int u : adj[v]) if (!used[u]) dfs1(u);
    order.push_back(v);
}
void dfs2(int v) {
    used[v] = true;
    component.push_back(v);
    for (int u : adj_rev[v]) if (!used[u]) dfs2(u);
}`
        },
        {
          id: 'snip-5-11',
          title: 'tarjan scc',
          filename: 'tarjan_scc.cpp',
          language: 'cpp',
          content: `vector<int> dfn, low, st;
vector<bool> in_st;
int timer = 0;
void tarjan(int u) {
    dfn[u] = low[u] = ++timer;
    st.push_back(u); in_st[u] = true;
    for (int v : adj[u]) {
        if (!dfn[v]) {
            tarjan(v);
            low[u] = min(low[u], low[v]);
        } else if (in_st[v]) {
            low[u] = min(low[u], dfn[v]);
        }
    }
    if (low[u] == dfn[u]) {
        while (true) {
            int node = st.back(); st.pop_back();
            in_st[node] = false;
            if (u == node) break;
        }
    }
}`
        }
      ]
    },
    {
      id: 'sec-6',
      title: '6 Math',
      snippets: [
        {
          id: 'snip-6-1',
          title: 'Lucas theorem',
          filename: 'lucas.tex',
          language: 'tex',
          isTex: true,
          content: `\\textbf{Lucas' Theorem:}\\\\
For non-negative integers $m$ and $n$ and a prime $p$,
\\[ \\binom{m}{n} \\equiv \\prod_{i=0}^k \\binom{m_i}{n_i} \\pmod{p} \\]
where $m = m_k p^k + \\dots + m_0$ and $n = n_k p^k + \\dots + n_0$ are the base-$p$ expansions.`
        },
        {
          id: 'snip-6-4',
          title: 'fft',
          filename: 'fft.cpp',
          language: 'cpp',
          content: `using cd = complex<double>;
const double PI = acos(-1);

void fft(vector<cd>& a, bool invert) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        double ang = 2 * PI / len * (invert ? -1 : 1);
        cd wlen(cos(ang), sin(ang));
        for (int i = 0; i < n; i += len) {
            cd w(1);
            for (int j = 0; j < len / 2; j++) {
                cd u = a[i + j], v = a[i + j + len / 2] * w;
                a[i + j] = u + v;
                a[i + j + len / 2] = u - v;
                w *= wlen;
            }
        }
    }
    if (invert) for (cd& x : a) x /= n;
}`
        }
      ]
    },
    {
      id: 'sec-7',
      title: '7 Matrix',
      snippets: [
        {
          id: 'snip-7-1',
          title: 'matrix',
          filename: 'matrix.cpp',
          language: 'cpp',
          content: `template<typename T>
struct Matrix {
    int n, m;
    vector<vector<T>> mat;
    Matrix(int n, int m) : n(n), m(m), mat(n, vector<T>(m, 0)) {}
    static Matrix identity(int n) {
        Matrix res(n, n);
        for (int i = 0; i < n; ++i) res.mat[i][i] = 1;
        return res;
    }
    Matrix operator*(const Matrix& o) const {
        Matrix res(n, o.m);
        for (int i = 0; i < n; ++i)
            for (int k = 0; k < m; ++k)
                for (int j = 0; j < o.m; ++j)
                    res.mat[i][j] = (res.mat[i][j] + mat[i][k] * o.mat[k][j]) % MOD;
        return res;
    }
};`
        }
      ]
    },
    {
      id: 'sec-8',
      title: '8 Misc',
      snippets: [
        {
          id: 'snip-8-1',
          title: 'Template Java',
          filename: 'Template.java',
          language: 'java',
          content: `import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer("");
        String next() {
            while (!st.hasMoreTokens()) {
                try { st = new StringTokenizer(br.readLine()); }
                catch (IOException e) { e.printStackTrace(); }
            }
            return st.nextToken();
        }
        int nextInt() { return Integer.parseInt(next()); }
    }
    public static void main(String[] args) {
        FastScanner fs = new FastScanner();
        PrintWriter out = new PrintWriter(System.out);
        out.flush();
    }
}`
        }
      ]
    },
    {
      id: 'sec-9',
      title: '9 Number theory',
      snippets: [
        {
          id: 'snip-9-4',
          title: 'ext euclidean',
          filename: 'ext_gcd.cpp',
          language: 'cpp',
          content: `long long extgcd(long long a, long long b, long long &x, long long &y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long x1, y1;
    long long d = extgcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - y1 * (a / b);
    return d;
}`
        },
        {
          id: 'snip-9-6',
          title: 'miller rabin',
          filename: 'miller_rabin.cpp',
          language: 'cpp',
          content: `using u64 = unsigned long long;
using u128 = __uint128_t;

u64 power(u64 base, u64 exp, u64 mod) {
    u64 res = 1;
    base %= mod;
    while (exp > 0) {
        if (exp % 2 == 1) res = (u128)res * base % mod;
        base = (u128)base * base % mod;
        exp /= 2;
    }
    return res;
}

bool miller_rabin(u64 n, int k = 5) {
    if (n < 2) return false;
    if (n == 2 || n == 3) return true;
    if (n % 2 == 0) return false;
    u64 d = n - 1;
    int s = 0;
    while (d % 2 == 0) { d /= 2; s++; }
    static const u64 bases[] = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};
    for (u64 a : bases) {
        if (n <= a) break;
        u64 x = power(a, d, n);
        if (x == 1 || x == n - 1) continue;
        bool composite = true;
        for (int r = 1; r < s; r++) {
            x = (u128)x * x % n;
            if (x == n - 1) { composite = false; break; }
        }
        if (composite) return false;
    }
    return true;
}`
        }
      ]
    },
    {
      id: 'sec-10',
      title: '10 Strings',
      snippets: [
        {
          id: 'snip-10-3',
          title: 'suffix array',
          filename: 'suffix_array.cpp',
          language: 'cpp',
          content: `vector<int> sort_cyclic_shifts(string const& s) {
    int n = s.size();
    const int alphabet = 256;
    vector<int> p(n), c(n), cnt(max(alphabet, n), 0);
    for (int i = 0; i < n; i++) cnt[s[i]]++;
    for (int i = 1; i < alphabet; i++) cnt[i] += cnt[i-1];
    for (int i = 0; i < n; i++) p[--cnt[s[i]]] = i;
    c[p[0]] = 0;
    int classes = 1;
    for (int i = 1; i < n; i++) {
        if (s[p[i]] != s[p[i-1]]) classes++;
        c[p[i]] = classes - 1;
    }
    return p;
}`
        },
        {
          id: 'snip-10-5',
          title: 'z algorithm',
          filename: 'z_algorithm.cpp',
          language: 'cpp',
          content: `vector<int> z_function(string s) {
    int n = (int) s.length();
    vector<int> z(n);
    for (int i = 1, l = 0, r = 0; i < n; ++i) {
        if (i <= r) z[i] = min (r - i + 1, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) ++z[i];
        if (i + z[i] - 1 > r) l = i, r = i + z[i] - 1;
    }
    return z;
}`
        }
      ]
    }
  ],
  updatedAt: new Date().toISOString()
};
